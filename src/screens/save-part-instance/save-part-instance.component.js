import React from 'react';
import { View, Alert, BackHandler } from 'react-native';
import { branch } from "baobab-react/higher-order";
import { Content, Text, Textarea } from 'native-base';
import { FormSplitter } from "../../components/form-splitter.component";
import { PartMaster } from "../../models/part-master";
import { commonStyle } from "../../styles/common.style";
import { savePartInstanceStyle as style } from './save-part-instance.style';
import { CreatedDate } from "../../components/created-date.component";
import { ServerImage } from "../../components/server-image.component";
import { TextInputValid } from '../../components/TextInputValid';
import { PartInstance } from "../../models/part-instance";
import { FormCheckbox } from "../../components/form-checkbox.component";
import { FormButtons } from "../../components/form-buttons";
import { PartInstanceImages } from "./part-instance-images.component";
import { Picker } from "../../components/picker/picker.component";
import BackendApi from "../../services/backend";
import { Organization } from "../../models/organization";
import { PartInstanceView } from "../../models/part-instance-view";
import { ImageAndFillData } from "../../models/image-and-fill-data";
import { CommonForm } from "../../components/common-form.component";
import { ScreenDetector } from "../../utils/screen-detector";
import { User } from "../../models/user";

type Props = {
    partMaster: PartMaster,
    organizations: Array<Organization>,
    user: User,
}

@branch({
    partMaster: ['partMasterDetail'],
    organizations: ['organizations'],
    user: ['user'],
})
export class SavePartInstance extends CommonForm<Props> {
    isEditPartInstance = false;
    currencySign = '$';

    constructor(props: Props) {
        super(props);
        const { params } = this.props.navigation.state;

        const partInstance: PartInstanceView = params && { ...params.partInstance };


        let model: PartInstance;
        let priceVal = null;
        let maxPriceLng = null;
        let images;

        if (partInstance) {
            model = { ...partInstance };
            images = partInstance.images;
            model.images = images ? images.map(i => i.imageId) : [];
            model.organizationId = partInstance.organization && partInstance.organization.organization_id;
            priceVal = model.price ? this.formatCurrency((model.price / 100).toFixed(2)) : null;
            maxPriceLng = priceVal ? priceVal.length : null;
            this.isEditPartInstance = true;
        }

        const { partMaster, user } = props;

        let partInstanceName: '';

        if (partMaster) {
          partInstanceName = partMaster.orgPartName ? partMaster.orgPartName : partMaster.partName;
        }

        this.state = {
            model: model || new PartInstance(partMaster.partMasterId, partInstanceName, user.organizationId),
            images: images ? images.map(i => i.path) : [],
            priceVal,
            maxPriceLng,
            disableBtn: false,
            initialModel : null
        };
        this.cancel = this.cancel.bind(this);
    }
    componentDidMount() {
        this.setState({
            initialModel: {...this.state.model}
        });
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.cancel();
            return true;
        });
        this.props.navigation.setParams({
            cancel: this.cancel
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    goToImageAndFill(imageId: number = null) {
        this.props.navigation.navigate('ImageAndFill', {
            imageId,
            feelData: data => this.feelData(data, !imageId),
            type: 'partInstance',
        });
    }

    feelData(data: ImageAndFillData) {
        const prevVal = this.state.model[data.field];

        if (data.field && data.value) {
            if (data.field === 'price') {
                this.setCurrency(data.value);
            } else {
                this.setValue(data.field, prevVal ? `${prevVal} ${data.value}` : data.value);
            }
            this.validateForm();
        }

        const { images, model } = this.state;
        if (model.images.indexOf(data.image.imageId) === -1) {
            model.images = [...model.images, data.image.imageId];
            this.setState({ images: [...images, data.image.path], model });
        }
    }

    onPressImage(index: number) {
        this.goToImageAndFill(this.state.model.images[index]);
    }

    save() {
        if (this.validateForm()) {
            this.setState({
                disableBtn: true,
            }, () => {
                const model = this.trimModel();

                if(model.tsn || model.tsn === 0 ){
                  model.tsn = model.tsn + '';
                } 
                if(model.tsmoh || model.tsmoh === 0 ){
                  model.tsmoh = model.tsmoh + '';
                } 
                if(model.csn || model.csn === 0 ){
                  model.csn = model.csn + '';
                } 
                if(model.csmoh || model.csmoh === 0 ){
                  model.csmoh = model.csmoh + '';
                }

                (this.isEditPartInstance ?
                    BackendApi.updatePartInstance(model) :
                    BackendApi.createPartInstance(model))
                    .then((data) => {
                        BackendApi.getPartInstanceList();
                        Alert.alert('Success', `Part instance was successfully ${this.isEditPartInstance ? 'updated' : 'created'}`, [{
                            text: 'OK', onPress: () =>
                            this.isEditPartInstance ? this.cancel() : this.props.navigation.navigate('PartInstance', data)
                        }]);
                    })
                    .catch(() => this.setState({ disableBtn: false }));
            });
        }
    }

    validateForm() {
        return ![
            // this.validateProductionOrderNumber(),
            this.validate(),
            this.validateName(),
            // this.validateTsn(),
            // this.validateTsmoh(),
            // this.validateCsmoh(),
            // this.validateCsn(),
            //  this.validatePrice(),
        ].reduce((err, val) => val ? ++err : err, 0);
    }
    formChanged() {
        return JSON.stringify(this.state.model) !== JSON.stringify(this.state.initialModel)
    }

    cancel() {
        if (this.formChanged()) {
            Alert.alert(
                'Confirmation',
                'Are you sure you want to leave this screen? Your changes will be lost if you leave.',
                [{
                    text: 'Yes', onPress: () => {
                        this.props.navigation.goBack();
                    }

                }, {
                    text: 'No', onPress: () => {},
                }]
            )
        } else {
            this.props.navigation.goBack();
        }

    }

    addImage(image: ImageData) {
        BackendApi.uploadRecognizaedImage(image);
        this.goToImageAndFill();
    }

    validate(): boolean {
        const { model } = this.state;
        const errMsg = 'Serial or Batch Number can not be empty';

        if (!model.batchNumber && !model.serialNumber) {
            this.setState({
                batchNumberError: errMsg,
                serialNumberError: errMsg,
            });
            return true;
        }

        this.setState({
            batchNumberError: null,
            serialNumberError: null,
        });

        return false;
    }
    validateProductionOrderNumber(): boolean  {
        return this.validateField('productionOrderNumber', 'Prduction Order Number');
    }
    validateTsn(): boolean {
        return this.validateForZeroPossibleInteger('tsn', 'TSN');
    }

    validateTsmoh(): boolean {
        return this.validateForZeroPossibleInteger('tsmoh', 'TSMOH');
    }

    validateCsmoh(): boolean {
        return this.validateForZeroPossibleInteger('csmoh', 'CSMOH');
    }

    validateCsn(): boolean {
        return this.validateForZeroPossibleInteger('csn', 'CSN');
    }

    validatePrice(): boolean {
        return this.validateForFloat('price', 'Price');
    }

    validateName(): boolean {
        return this.validateField('name', 'Name');
    }

    validateIssue(): boolean {
        return this.validateField('issue', 'Issue');
    }

    removeImage(index: number) {
        const { images, model } = this.state;

        images.splice(index, 1);
        model.images.splice(index, 1);

        this.setState({ images, model });
    }

    selectOrganization(name, organizationId) {
        const { model } = this.state;
        model.organizationId = organizationId;

        this.setState({ model });
    }

    render() {
        let partMaster = null;
        if (this.props.navigation.state.params && this.props.navigation.state.params.partInstance) {
             partMaster = this.props.navigation.state.params.partInstance.partMaster;
        } else {
            partMaster = this.props.partMaster;
        }

        return (
            <Content style={style.partInstanceBg}>
                <FormSplitter text="Manufacturer Data"/>
                <View style={[commonStyle.rowBetween, style.partMasterContainer]}>
                    <View style={commonStyle.flex(0.65)}>
                        <Text style={style.titleText}>PART #: {partMaster && partMaster.mpn.toUpperCase()}</Text>
                        <Text style={[style.titleText, commonStyle.indent(8)]}>NAME: {partMaster && partMaster.partName}</Text>
                        <Text style={[style.text, commonStyle.textBold]}>ORIGINAL EQUIPMENT MANUFACTURER</Text>
                        <Text style={style.text}>{partMaster && partMaster.oem}</Text>
                    </View>
                    <View style={[commonStyle.flex(0.45), commonStyle.alignEnd]}>
                        <View style={commonStyle.indent(ScreenDetector.isPhone() ? 5 : 15)}>
                            <CreatedDate date={partMaster && partMaster.createdAt} fontSize={ScreenDetector.isPhone() ? 10 : 16}/>
                        </View>
                        <ServerImage style={style.partMasterImage} uri={partMaster && partMaster.image && partMaster.image.path}/>
                    </View>
                </View>
                <FormSplitter text="Organization Data"/>
                <View style={[commonStyle.rowBetween, style.partMasterContainer, commonStyle.marginHorizontal(-10)]}>
                    <View style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(10)]}>
                        <Text style={[style.text, commonStyle.textBold]}>PART #</Text>
                        <Text style={style.text}>{partMaster && partMaster.orgPartNumber}</Text>
                    </View>
                    <View style={[commonStyle.flex(0.5), commonStyle.marginHorizontal(10)]}>
                        <Text style={[style.text, commonStyle.textBold]}>PART NAME</Text>
                        <Text style={style.text}>{partMaster && partMaster.orgPartName}</Text>
                    </View>
                </View>
                <PartInstanceImages
                    onPressImage={(i) => this.onPressImage(i)}
                    images={this.state.images}
                    addImage={(image) => this.addImage(image)}
                    removeImage={(number) => this.removeImage(number)}
                />
                <View style={style.formContainer}>
                    {this.renderInput('* Part Instance Name', 'name', this.validateName, false, 40)}
                    <View style={[commonStyle.flexRow, commonStyle.marginHorizontal(-5)]}>
                        <View style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(5)]}>
                            {this.renderInput('* Serial Number', 'serialNumber', this.validate, false, 15)}
                        </View>
                        <View style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(5)]}>
                            {this.renderInput('* Batch Number', 'batchNumber', this.validate, false, 10)}
                        </View>
                    </View>
                    <View style={[commonStyle.flexRow, commonStyle.marginHorizontal(-5)]}>
                        <View  style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(5)]}>
                            <Text style={commonStyle.inputLabel}>Owner Organization</Text>
                            <Picker
                            items={this.props.organizations.map(c => ({ title: c.name, value: c.organization_id }))}
                            title="Owner Organizations"
                            defaultText="Choose organization"
                            selected={this.state.model.organizationId}
                            onSelect={({ title, value }) => this.selectOrganization(title, value)}
                            />
                        </View>
                        <View style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(5)]}>
                            {this.renderInput('Issue', 'issue', this.validateIssue, false, 40)}
                        </View>
                    </View>
                    {this.renderTextArea('Description', 'description')}
                    <View style={[commonStyle.flexRow, commonStyle.marginHorizontal(-5)]}>
                        <View style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(5)]}>
                            {this.renderInput('TSN', 'tsn', this.validateTsn, true)}
                            {this.renderInput('TSMOH', 'tsmoh', this.validateTsmoh, true)}
                            {this.renderInput('Material Spec', 'materialSpec')}
                            {this.renderInput('* Production Order Number', 'productionOrderNumber')}
                            {this.renderInput('Airworthiness Certificate Tracking Number from original manufacturer', 'airworthinessCertificateTrackingNumber')}
                            {this.renderInput('Acquisition Date', 'acquisitionDate')}
                            <FormCheckbox
                                checked={this.state.model.isSale}
                                text="Available for Sale"
                                onPress={() => this.setValue('isSale', !this.state.model.isSale)}
                            />
                        </View>
                        <View style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(5)]}>
                            {this.renderInput('CSMOH', 'csmoh', this.validateCsmoh, true)}
                            {this.renderInput('Item Unique Indetifier', 'iuid')}
                            {this.renderInput('Commodity Code', 'commodityCode')}
                            {this.renderInput('Acquisition', 'acquisitionValue')}
                            {this.renderInput('Condition', 'condition.name')}
                            {console.log(this.state.model)}
                            <Text style={commonStyle.inputLabel}>Price</Text>
                            <TextInputValid
                                style={[commonStyle.input, commonStyle.colorBlack]}
                                onChangeText={(text) => {
                                    this.setCurrency(text, 'price');
                                    this.validatePrice();
                                }}
                                value={this.state.priceVal}
                                error={this.state.priceError}
                                maxLength={this.state.maxPriceLng || 16}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    <FormButtons
                        disabled={this.state.disableBtn}
                        okBtnText={this.isEditPartInstance ? 'Update' : 'Create'}
                        onOkPress={() => this.save()}
                        onCancelPress={() => this.cancel()}
                    />
                </View>
            </Content>
        )
    }
}
