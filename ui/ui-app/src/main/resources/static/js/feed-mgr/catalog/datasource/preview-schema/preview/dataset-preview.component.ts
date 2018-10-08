import {Component, Input, OnInit} from "@angular/core";
import {DatasetPreviewDialogComponent, DatasetPreviewDialogData} from "../preview-dialog/dataset-preview-dialog.component";
import {FormGroup} from "@angular/forms";
import {TdDialogService} from "@covalent/core/dialogs";
import {MatDialogConfig, MatTabChangeEvent} from "@angular/material";
import {PreviewSchemaService} from "../service/preview-schema.service";
import {PreviewRawService} from "../service/preview-raw.service";
import {PreviewFileDataSet} from "../model/preview-file-data-set";
import {PreviewDataSet} from "../model/preview-data-set";
import {SchemaParseSettingsDialog} from "../schema-parse-settings-dialog.component";
import {SchemaParser} from "../../../../model/field-policy";
import {PreviewDataSetRequest} from "../model/preview-data-set-request";
import {TdLoadingService} from "@covalent/core/loading";
import {DatasetPreviewService} from "../service/dataset-preview.service";


@Component({
    selector: "dataset-preview",
    styleUrls:["js/feed-mgr/catalog/datasource/preview-schema/preview/dataset-preview.component.scss"],
    templateUrl: "js/feed-mgr/catalog/datasource/preview-schema/preview/dataset-preview.component.html"
})
export class DatasetPreviewComponent implements OnInit{

    @Input()
    displayTitle?:boolean = true;

    @Input()
    dataset:PreviewDataSet

    @Input()
    formGroup:FormGroup;



    rawReady:boolean;

    constructor(private _dialogService: TdDialogService,
                private _loadingService:TdLoadingService,
                private _datasetPreviewService:DatasetPreviewService){

    }
    ngOnInit(){



    }

    onTabChange($event:MatTabChangeEvent){
        //load Raw data if its not there
        if($event.tab.textLabel.toLowerCase() == "raw"){
            if(this.dataset.hasRaw()){
                this.rawReady = true;
            }
            if(this.dataset instanceof PreviewFileDataSet) {

                if (!this.dataset.hasRaw() && !this.dataset.hasRawError()) {
                    this._datasetPreviewService.notifyToUpdateView();
                    this._loadingService.register(DatasetPreviewService.RAW_LOADING)
                    this._datasetPreviewService.previewAsTextOrBinary(<PreviewFileDataSet>this.dataset,false,true).subscribe((ds: PreviewDataSet) => {
                        this._loadingService.resolve(DatasetPreviewService.RAW_LOADING)
                        this.rawReady = true;
                        this.dataset.rawLoading = false;
                        this._datasetPreviewService.notifyToUpdateView();
                    }, (error1: any) => {
                        this.rawReady = true;
                        this.dataset.rawLoading = false;
                        this._loadingService.resolve(DatasetPreviewService.RAW_LOADING)
                        this._datasetPreviewService.notifyToUpdateView();
                    });
                }
            }
        }
        this._datasetPreviewService.notifyToUpdateView();
    }




    /**
     * Update the dialog and position it in the center and full screen
     *
     */
    fullscreen(){
        if(this.dataset && this.dataset.preview){
            let dialogConfig:MatDialogConfig = DatasetPreviewDialogComponent.DIALOG_CONFIG()
            let dialogData:DatasetPreviewDialogData = new DatasetPreviewDialogData(this.dataset)
            dialogConfig.data = dialogData;
            this._dialogService.open(DatasetPreviewDialogComponent,dialogConfig);
        }
    }



}