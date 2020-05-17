import {StateService} from "../state.service";
import {PartMaster} from "../../models/part-master";
import {PartInstance} from "../../models/part-instance";
import {FileData} from "../../models/file-data";

export const partsApi = {
    getPartInstanceTimeLine(partInstanceId: string) {
        this.lastPartInstanceId = partInstanceId;

        StateService.setPartInstanceTimeLine(null);
        StateService.setPartInstanceDrafts(null);
        StateService.setEvent81303Drafts(null);
        return this.getTimeLineByPartId('instance', partInstanceId)
            .then(({events, drafts, event81303Drafts}) => {
                StateService.setPartInstanceTimeLine(events);
                StateService.setPartInstanceDrafts(drafts);
                StateService.setEvent81303Drafts(event81303Drafts);
            });
    },

    refreshPartInstanceTimeLine() {
        if (this.lastPartInstanceId) {
            this.getPartInstanceTimeLine(this.lastPartInstanceId);
        }
    },

    getPartMasterTimeLine(partMasterId: string) {
        StateService.setPartMasterTimeLine(null);
        StateService.setPartMasterDrafts(null);

        this.lastPartMasterId = partMasterId;

        return this.getTimeLineByPartId('master', partMasterId)
            .then(({events, drafts}) => {
                StateService.setPartMasterDrafts(drafts);
                StateService.setPartMasterTimeLine(events)
            });
    },

    refreshPartMasterTimeLine() {
        if (this.lastPartMasterId) {
            this.getPartMasterTimeLine(this.lastPartMasterId);
        }
    },

    getTimeLineByPartId(type: string, partId: number) {
        return this.axios.get(`/v1/parts/${type}/${partId}/events`)
            .then(this.resHandler);
    },

    getEventsLists(page: number = 1, query: string, limit: number) {
        if (page === 1) {
            StateService.setEventsItems([]);
        }
        return this.getPartList('event', page, query, limit)
            .then(({events = [], hasNext}) => {
                events.sort((a, b) => parseInt(b.createdAt) - parseInt(a.createdAt));

                if (page === 1) {
                    StateService.setEventsItems(events);
                } else {
                    StateService.concatEventsItems(events);
                }

                return !!hasNext;
            });
    },

    getPartMasterList(page: number = 1, query: string, limit: number, not_serialized = false) {
        if (page === 1) {
            StateService.setPartMasterItems([]);
        }
        return this.getPartList('master', page, query, limit, not_serialized)
            .then(({partMaster = [], hasNext}) => {
                if (!query) {
                    partMaster.sort((a, b) => parseInt(b.createdAt) - parseInt(a.createdAt));
                }

                if (page === 1) {
                    StateService.setPartMasterItems(partMaster);
                } else {
                    StateService.concatPartMasterItems(partMaster);
                }

                return !!hasNext;
            });
    },

    getPartInstanceList(page: number = 1, query: string, limit: number) {
        if (page === 1) {
            StateService.setPartInstanceItems([]);
        }
        return this.getPartList('instance', page, query, limit)
            .then(({partInstance = [], hasNext}) => {
                if (!query) {
                    partInstance.sort((a, b) => parseInt(b.createdAt) - parseInt(a.createdAt));
                }

                if (page === 1) {
                    StateService.setPartInstanceItems(partInstance);
                } else {
                    StateService.concatPartInstanceItems(partInstance);
                }

                return !!hasNext;
            });
    },

    getPartList(type: string, page: number = 1, query: string = '', limit: number = 10, not_serialized = false) {
        return this.axios.get(`/v1/parts/${type}/list`, {
            params: {
                page,
                query,
                limit,
                not_serialized
            }
        })
            .then(this.resHandler)
            .then(data => {
                return data;
            });
    },

    getPartMaster(id: number) {
        StateService.setPartMaster(null);
        return this.axios.get(`/v1/parts/master/${id}`)
            .then(this.resHandler)
            .then(({data}) => StateService.setPartMaster(data));
    },

    getPartMasterDetail(id: number) {
        StateService.setPartMasterDetail(null);
        return this.axios.get(`/v1/parts/master/${id}`)
            .then(this.resHandler)
            .then(({data}) => StateService.setPartMasterDetail(data));
    },

    createPartMaster(partMaster: PartMaster) {
        return this.axios.post('/v1/parts/master', partMaster)
            .then(this.resHandler)
            .then((data) => {
                return data
            });
    },

    updatePartMaster(partMaster: PartMaster) {
        return this.axios.put('/v1/parts/master', partMaster)
            .then(this.resHandler)
            .then(() => {
                StateService.setPartMaster(partMaster);
                this.getPartMasterDetail(partMaster.partMasterId);
                this.getPartMasterTimeLine(partMaster.partMasterId);
                return Promise.resolve();
            });
    },

    createPartInstance(partInstance: PartInstance) {
        return this.axios.post('/v1/parts/instance', partInstance)
            .then(this.resHandler)
            .then((data) => {
                return data
            });
    },

    getPartInstance(id: string) {
        StateService.setPartInstance(null);
        return this.axios.get(`/v1/parts/instance/${id}`)
            .then(this.resHandler)
            .then(({data}) => StateService.setPartInstance(data));
    },

    getPartInstanceDetail(id: string) {
        StateService.setPartInstanceDetail(null);
        return this.axios.get(`/v1/parts/instance/${id}`)
            .then(this.resHandler)
            .then(({data}) => StateService.setPartInstanceDetail(data));
    },

    updatePartInstance(partInstance: PartInstance) {
        return this.axios.put('/v1/parts/instance', partInstance)
            .then(this.resHandler)
            .then(() => {
                StateService.setPartInstance(partInstance);
                // this.getPartInstance(partInstance.partInstanceId);
                this.getPartInstanceDetail(partInstance.partInstanceId)
                this.getPartInstanceTimeLine(partInstance.partInstanceId)
                return Promise.resolve();
            });
    },

    recognizeByImageId(imageId: string) {
        StateService.setImageForFill(null);

        return this.axios.get(`/v1/parts/images/${imageId}/recognize`)
            .then(this.resHandler)
            .then(this.parseImageData)
            .then((image) => StateService.setImageForFill(image));
    },

    uploadRecognizaedImage(image: FileData) {
        StateService.setImageForFill(null);

        return this.uploadImage(image, 'partMaster', true)
            .then(this.parseImageData)
            .then((image) => StateService.setImageForFill(image));
    },

    parseImageData({data}) {
        let json;
        if (data.googleVisionDetection) {
            json = JSON.parse(data.googleVisionDetection);
        }
        return {...data, googleVisionDetection: json ? json.textAnnotations : []};
    },
    getAlternateNumbers(partMasterId) {
        StateService.setAlternatePartNumbers(null);
        return this.axios.get(`/v1/parts/master/${partMasterId}/alternateNumbers`).then(this.resHandler)
            .then(({data}) => {
                StateService.setAlternatePartNumbers(data)
            });
    },

    followPartMaster(partMasterId: string) {
        return this._toggleFollowPart('post', 'master', partMasterId);
    },

    unfollowPartMaster(partMasterId: string) {
        return this._toggleFollowPart('delete', 'master', partMasterId);
    },

    followPartInstance(partnInstanceId: string) {
        return this._toggleFollowPart('post', 'instance', partnInstanceId);
    },

    unfollowPartInstance(partnInstanceId: string) {
        return this._toggleFollowPart('delete', 'instance', partnInstanceId);
    },

    _toggleFollowPart(action: string, type: string, partId: string) {
        return this.axios[action](`/v1/parts/${type}/${partId}/follow`)
            .then(this.resHandler);
    },
    getUOM() {
        return this.axios.get(`/v1/uom`)
            .then(this.resHandler)
            .then(({data}) => { return data});
    }

};


