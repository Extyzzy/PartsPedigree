import React from 'react';
import {View, Alert, TouchableOpacity, Image, BackHandler} from 'react-native';
import {Content, Form, Text, Textarea} from 'native-base';
import {branch} from 'baobab-react/higher-order';
import {PartMasterPhoto} from './part-master-photo.component';
import {Country} from '../../models/country';
import {PartMaster} from '../../models/part-master';
import {createPartMasterStyle as style} from './create-part-master.style';
import BackendApi from '../../services/backend';
import {FormSplitter} from "../../components/form-splitter.component";
import {commonStyle} from "../../styles/common.style";
import {FormCheckbox} from "../../components/form-checkbox.component";
import {FormButtons} from "../../components/form-buttons";
import {Picker} from "../../components/picker/picker.component";
import {ImageAndFillData} from "../../models/image-and-fill-data";
import {partMasterUOM} from "../../constants/uoms";
import {CommonForm} from "../../components/common-form.component";
import {ScreenDetector} from "../../utils/screen-detector";
import Cancel from "../cancel-pop-up/cancel";

type Props = {
    countries: Array<Country>;
}

type State = {
    model: PartMaster;
    initialModel: PartMaster;
    country: string;
    initialCountry: string;
    disableBtn: boolean;
}

@branch({
    countries: ['countries'],
    user: ['user'],
    organizations: ['organizations'],
})
export class CreatePartMaster extends CommonForm<Props> {
    state: State;
    isEditPartMaster = false;

    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        const partMaster: PartMaster = params && {...params.partMaster};

        if (partMaster) {
            partMaster.countryId = partMaster.country && partMaster.country.countryId;
            partMaster.imageId = partMaster.image && partMaster.imageId;
            partMaster.uomId = partMaster.uom && partMaster.uom.uomId;
            this.isEditPartMaster = true;
        }

        this.state = {
            model: partMaster || new PartMaster(),
            initialModel: partMaster ? JSON.parse(JSON.stringify(partMaster))
                : JSON.parse(JSON.stringify(new PartMaster())),
            country: partMaster ? this.getCountryName(partMaster.countryId) : '',
            initialCountry: partMaster ? this.getCountryName(
                partMaster.countryId) : '',
            modal: false,
            uom: []
        };

        this.formChanged = this.formChanged.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                this.cancel();
            return true;
        });

        this.props.navigation.setParams({
            cancel: this.cancel
        });
        BackendApi.getUOM().then((data) => {
            this.setState({
                uom: data
            })
        });

    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    feelData(data: ImageAndFillData) {
        const {model} = this.state;
        model.image = data.image;
        model.imageId = data.image.imageId;
        this.setState({model});

        if (data.field) {
            const prevVal = model[data.field];
            this.setValue(data.field, prevVal ? `${prevVal} ${data.value}` : data.value);
        }
    }

    save() {
        if (this.validateForm()) {
            const model = this.trimModel();
            if (this.isEditPartMaster) {
                Object.assign(model, {
                    imageId: model.image.imageId
                })
            }
            this.checkExportControlled()
                .then(() => this.setState({disableBtn: true}))
                .then(() => {
                    return this.isEditPartMaster ?
                        BackendApi.updatePartMaster(model) :
                        BackendApi.createPartMaster(model);
                })
                .then((data) => {
                    Alert.alert('Success', `Part master was successfully ${this.isEditPartMaster ? 'updated' : 'created'}`, [{
                        text: 'OK',
                        onPress: () => this.props.navigation.navigate(
                            'PartMaster', {partMasterId: this.isEditPartMaster ? this.state.model.partMasterId : data.partMasterId})
                    }]);
                })
                .catch(() => this.setState({disableBtn: false}));
        }
    }

    validateForm() {
        return ![
            this.validateName(),
            this.validateNpm(),
            this.validateOem(),
            this.validateCountry(),
            this.validateOrgPartNumber(),
            this.validateOrgPartName(),
            //this.validateUom(),
            this.validateManufacturerCage(),
        ].reduce((err, val) => val ? ++err : err, 0);
    }

    formChanged = () =>  {
        return JSON.stringify(this.state.model) !== JSON.stringify(
                this.state.initialModel) || this.state.country
            !== this.state.initialCountry
    }

    cancel() {
        if (this.formChanged()) {
            Alert.alert(
                'Confirmation',
                'Are you sure you want to leave this screen? Your changes will be lost if you leave.',
                [{
                    text: 'Yes', onPress: () => {
                        this.props.navigation.goBack()
                    }

                }, {
                    text: 'No', onPress: () => {
                    },
                }]
            )
        } else {
            this.props.navigation.goBack()
        }


    }

    goToImageAndFill(edit: boolean) {
        const imageId = edit && this.state.model.image.imageId;
        this.props.navigation.navigate('ImageAndFill', {
            imageId,
            feelData: data => this.feelData(data),
            type: 'partMaster'
        });
    }

    onChangeImage(image: ImageData) {
        if (image === null) {
            const {model} = this.state;
            model.image = null;
            model.imageId = null;
            return this.setState({model});
        }

        BackendApi.uploadRecognizaedImage(image);
        this.goToImageAndFill();
    }

    checkExportControlled() {
        return new Promise((resolve, reject) => {
            if (this.state.model.exportControlledPart) {
                return resolve();
            }

            Alert.alert(
                'Export Controlled Part was not selected. Please confirm to continue',
                '',
                [
                    {
                        text: 'Confirm',
                        onPress: resolve,
                    },
                    {
                        text: 'Cancel',
                        onPress: reject,
                    }
                ]);
        })
    }

    getCountryName(id): string {
        const country = this.props.countries.find(i => i.country_id === id);
        return country ? country.name : '';
    }

    validateName(): boolean {
        return this.validateField('partName', 'Part Name');
    }

    validateNpm(): boolean {
        return this.validateField('mpn', 'MPN');
    }

    validateOem(): boolean {
        return this.validateField('oem', 'OEM');
    }

    validateCountry(): boolean {
        return this.validateField('countryId', 'Country');
    }

    validateOrgPartNumber(): boolean {
        return this.validateField('orgPartNumber', 'Part Number');
    }

    validateOrgPartName(): boolean {
        return this.validateField('orgPartName', 'Part Name');
    }

    validateManufacturerCage() {
        return this.validateField('manufacturerCage', 'Manufacturer Cage')
    }

    validateOrgCageCode() {
        return this.validateField('orgCageCode', 'Cage Code')
    }

    validateUom() {
        const field = 'uomId';
        const title = 'Unit of Measure';

        return this.validateField(field, title) || this.validateForInteger(field, title);
    }

    copyMfg() {
        const {model} = this.state;
       let org = this.props.organizations.find((org) => {
            return org.organization_id === this.props.user.organizationId
        });

        model.orgPartName = model.partName;
        model.orgPartNumber = model.mpn;
        model.orgCageCode =  org.cageCode || 'N/A';
        model.orgDescription = model.description;

        this.setState({model}, () => {
            this.validateOrgPartNumber();
            this.validateOrgPartName();
            this.validateOrgCageCode();
        });

    }

    selectCountry(name, countryId) {
        const {model} = this.state;
        model.countryId = countryId;
        model.country = {name, countryId};

        this.setState({
            model,
            country: name,
        });
        this.validateCountry();
    }

    renderUom() {
        // const pickerItems = Object.keys(partMasterUOM).map(key => ({title: key, value: partMasterUOM[key]}));
        const pickerItems = this.state.uom && this.state.uom.map((item) => {
            return ({title:item.name, value:item.uomId})
        });
        pickerItems.sort(function(a,b) {
            let x = a.title.toLowerCase();
            let y = b.title.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        return (
            <View>
                <Text style={commonStyle.inputLabel}>Unit of Measure</Text>
                <Picker
                    items={pickerItems}
                    title="Units of Measure"
                    error={this.state.uomIdError}
                    defaultText="Choose unit of measure"
                    selected={this.state.model.uomId}
                    onSelect={({title, value}) => this.setValue('uomId', value)}
                    //onCancel={() => this.validateUom()}
                />
            </View>
        )
    }

    render() {
        return (
            <Content>
                <FormSplitter text="Manufacturer Data"/>
                <PartMasterPhoto
                    onPressImage={() => this.goToImageAndFill(true)}
                    imageUrl={this.state.model.image && this.state.model.image.path}
                    onChange={image => this.onChangeImage(image)}
                />
                <View style={style.form}>
                    {this.renderInput('* Manufacturer Part Number', 'mpn', this.validateNpm, false, 40)}
                    {this.renderInput('* Part Name', 'partName', this.validateName, false, 40)}
                    {this.renderInput('* Original Equipment Manufacturer', 'oem', this.validateOem, false, 255)}
                    <View style={{ width: '100%',
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                        height: 40,
                        marginBottom: 10}}>
                    <Text style={commonStyle.inputLabel}>* Country Of Origin</Text>
                    <Picker
                        items={this.props.countries.map(c => ({title: c.name, value: c.country_id}))}
                        title="Country of Origin"
                        error={this.state.countryIdError}
                        defaultText="Choose country"
                        selected={this.state.model.countryId}
                        onSelect={({title, value}) => this.selectCountry(title, value)}
                        onCancel={() => this.validateCountry()}
                    />
                    </View>
                    {this.renderTextArea('Description', 'description')}
                    <View style={{ width: '100%',
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                    height: 40,
                    marginBottom: 10}}>
                    {this.renderUom()}
                    </View>
                    {this.renderInput('CAGE Code', 'manufacturerCage', this.validateManufacturerCage)}
                    <FormCheckbox
                        onPress={() => this.setValue('exportControlledPart', !this.state.model.exportControlledPart, false)}
                        checked={this.state.model.exportControlledPart}
                        text="Export Controlled Part"
                    />
                </View>
                <FormSplitter text="Organization Data"/>
                <Form style={style.form}>
                    <View style={[commonStyle.flexRow, commonStyle.justifyEnd]}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.copyMfg()}
                            style={[commonStyle.flexRow, commonStyle.indent(5)]}
                        >
                            <Image
                                style={commonStyle.size(ScreenDetector.isPhone() ? 19 : 27)}
                                source={require('../../assets/icons/icon_copy.png')}
                            />
                            <Text style={style.copyBtnText}>Copy MFG data</Text>
                        </TouchableOpacity>
                    </View>
                    {this.renderInput('* My Organization Part Number', 'orgPartNumber', this.validateOrgPartNumber, false, 40)}
                    {this.renderInput('* My Organization Part Name', 'orgPartName', this.validateOrgPartName, false, 40)}
                    {this.renderInput('CAGE Code', 'orgCageCode', this.validateOrgCageCode, false, 40)}
                    {this.renderTextArea('Description', 'orgDescription')}
                    <FormButtons
                        disabled={this.state.disableBtn}
                        okBtnText={this.isEditPartMaster ? 'Update' : 'Create'}
                        onOkPress={() => this.save()}
                        onCancelPress={() => {
                            this.cancel()
                        }}
                    />
                </Form>
            </Content>
        )
            ;
    }
}