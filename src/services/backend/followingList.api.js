import { StateService } from "../state.service";

export const followingListApi = {
    getStats() {
        return this.axios.get(`/v1/statistics`).then(this.resHandler).then(data => {return data})
    },
    getFollowingList(cursor: string) {
        return this.axios.get(`/v1/followingItems`)
            .then(this.resHandler)
            .then(async ({ data, cursorNext }) => {

                let partInstances = await data.partInstances.map(data => {

                  let instance = Object.assign({}, data);
                  instance.item.typeOfObject = 'partInstance';

                  return instance;
                });

                let partMasters = await data.partMasters.map(data => {

                  let master = Object.assign({}, data);
                  master.item.typeOfObject = 'partMaster';

                  return master;
                });

                let mastersInstances = await [...partInstances, ...partMasters];

                let sortedMastersInstances = await mastersInstances.sort((a, b) => b.date - a.date);
                if (cursor) {
                    StateService.concatFollowingList(sortedMastersInstances);
                } else {
                    StateService.setFollowingList(sortedMastersInstances);
                }

                return cursorNext;
            });
    }
};