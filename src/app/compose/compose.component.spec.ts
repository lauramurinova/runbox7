import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RunboxWebmailAPI} from '../rmmapi/rbwebmail';
import {DraftDeskService, DraftFormModel} from './draftdesk.service';
import {HttpClient} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {Location} from '@angular/common';
import {DialogService} from '../dialog/dialog.service';
import {ComposeComponent} from './compose.component';
import {autoSpy} from "../../../auto-spy";

fdescribe('ComposeComponent', () => {

    it('it should create', () => {
        const {build} = setup().default();
        const component = build();
        expect(component).toBeTruthy();
    });

    it('should return size in kb', () => {
        const {build} = setup().default();
        const component = build();
        expect(component.formatBytes(527797)).toEqual('515.43 KB');
        expect(component.formatBytes(123)).toEqual('123 Bytes');
        expect(component.formatBytes(3890299)).toEqual('3.71 MB');
        expect(component.formatBytes(5889)).toEqual('5.75 KB');
        expect(component.formatBytes(52779765900)).toEqual('49.15 GB');

        expect(component.formatBytes(527797) === ('515.40 KB')).toBeFalsy();
        expect(component.formatBytes(123) === ('123 KB')).toBeFalsy();
        expect(component.formatBytes(3890299) === ('3.89 MB')).toBeFalsy();
        expect(component.formatBytes(5889) === ('5.75 MB')).toBeFalsy();
        expect(component.formatBytes(52779765900) === ('52.40 GB')).toBeFalsy();
    });

    it('should navigate to home', () => {
        const {build, router} = setup().default();
        const component = build();
        component.exitToTable();
        expect(router.navigate).toHaveBeenCalledWith(['/']);
    });


    it('should hide dropZone', () => {
        const {build} = setup().default();
        const component = build();
        component.hideDropZone();
        expect(component.draggingOverDropZone).toBeFalsy();
        expect(component.showDropZone).toBeFalsy();
    });

    it('should close editing', () => {
        const {build} = setup().default();
        const component = build();
        component.close();
        expect(component.editing).toBeFalsy();
    });

    it('should emit delete draft', () => {
        const {build, router} = setup().default();
        const component = build();
        spyOn(component.draftDeleted, 'emit');
        component.cancelDraft();
        expect(component.draftDeleted.emit).toHaveBeenCalled();
        expect(component.draftDeleted.emit).toHaveBeenCalledWith(component.model.mid);
    });


    it('should remove attachment', () => {
        const {build} = setup().default();
        const component = build();
        component.model = new DraftFormModel();
        component.model.attachments = [];
        component.model.attachments.push("Attachment 1");
        component.model.attachments.push("Attachment 2");
        component.model.attachments.push("Attachment 3");
        component.removeAttachment(2);
        expect(component.model.attachments).toEqual(['Attachment 1', 'Attachment 2']);
        component.removeAttachment(1);
        expect(component.model.attachments).toEqual(['Attachment 1']);
        component.removeAttachment(0);
        expect(component.model.attachments).toEqual([]);
    });


});

function setup() {
    const router = autoSpy(Router);
    const snackBar = autoSpy(MatSnackBar);
    const rmmapi = autoSpy(RunboxWebmailAPI);
    const draftDeskservice = autoSpy(DraftDeskService);
    const http = autoSpy(HttpClient);
    const formBuilder = autoSpy(FormBuilder);
    const location = autoSpy(Location);
    const dialogService = autoSpy(DialogService);
    const builder = {
        router,
        snackBar,
        rmmapi,
        draftDeskservice,
        http,
        formBuilder,
        location,
        dialogService,
        default() {
            return builder;
        },
        build() {
            return new ComposeComponent(router, snackBar, rmmapi, draftDeskservice, http, formBuilder, location, dialogService);
        }
    };

    return builder;
}
