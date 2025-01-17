0// --------- BEGIN RUNBOX LICENSE ---------
// Copyright (C) 2016-2018 Runbox Solutions AS (runbox.com).
// 
// This file is part of Runbox 7.
// 
// Runbox 7 is free software: You can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, either version 3 of the License, or (at your
// option) any later version.
// 
// Runbox 7 is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Runbox 7. If not, see <https://www.gnu.org/licenses/>.
// ---------- END RUNBOX LICENSE ----------

import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ENTER } from '@angular/cdk/keycodes';
import { debounceTime } from 'rxjs/operators';
import { RecipientsService } from './recipients.service';
import { Recipient } from './recipient';

const COMMA = 188;

@Component({
    moduleId: 'angular2/app/compose/',
    // tslint:disable-next-line:component-selector
    selector: 'mailrecipient-input',
    templateUrl: 'mailrecipientinput.component.html'
})
export class MailRecipientInputComponent implements OnInit, AfterViewInit {
    filteredRecipients: BehaviorSubject<Recipient[]> = new BehaviorSubject([]);

    searchTextFormControl: FormControl = new FormControl();
    recipientsList: string[] = [];

    separatorKeysCodes = [COMMA, ENTER];

    addedFromAutoComplete = false;
    invalidemail = false;

    @Input() recipients: string;
    @Input() placeholder: string;
    @Input() initialfocus = false;

    @Output() change: EventEmitter<string> = new EventEmitter();

    @ViewChild('searchTextInput', { static: false }) searchTextInput: ElementRef;
    @ViewChild('auto', { static: false }) auto: MatAutocomplete;

    constructor(
        private snackBar: MatSnackBar,
        recipientservice: RecipientsService
    ) {
        recipientservice.recipients.subscribe((recipients) => {

        // Listen to search text input and popup suggestions from recipient list
        this.searchTextFormControl.valueChanges
            .pipe(debounceTime(50))
            .subscribe((searchtext: string | Recipient) => {
                if (searchtext) {
                    const lowercaseSearchText = searchtext.toString().toLowerCase();
                    this.filteredRecipients.next(
                        recipients.filter(recipient =>
                            recipient.name.toLowerCase().indexOf(lowercaseSearchText) > -1
                        )
                    );
                } else {
                    this.filteredRecipients.next([]);
                }
            }
            );
        });
    }

    ngOnInit() {
        this.recipientsList = this.recipients ?
            this.recipients.split(',').map((recipient) => recipient.trim()) :
            [];
    }

    ngAfterViewInit() {
        if (this.initialfocus) {
            this.searchTextInput.nativeElement.focus();
        }
    }

    notifyChangeListener() {
        this.change.emit(this.recipientsList.join(','));
    }

    removeRecipient(ndx: number) {
        this.recipientsList.splice(ndx, 1);
        this.notifyChangeListener();
        this.invalidemail = false;
    }


    addRecipientFromAutoComplete(recipient: Recipient) {
        this.invalidemail = false;
        this.addedFromAutoComplete = true;

        const recipientCount = recipient.toStringList().length;

        if (recipientCount > 1) {
            const recipientsListBackup = this.recipientsList.slice();

            this.snackBar.open(
                recipientCount + ' contacts added to recipient list',
                'Undo', { duration: 3000 }
            ).onAction().subscribe(() => {
                this.recipientsList = recipientsListBackup;
            });
        }

        for (const r of recipient.toStringList()) {
            this.recipientsList.push(r);
        }

        this.notifyChangeListener();
        this.searchTextInput.nativeElement.value = '';
    }

    addRecipientFromBlur() {
        const input = this.searchTextInput.nativeElement;
        const value = (input.value || '').trim();

        if (!this.auto.isOpen && this.searchTextFormControl.valid) {
            this.invalidemail = false;

            if (value) {
                this.recipientsList.push(value);
                this.notifyChangeListener();
                input.value = '';
            }
        } else if (value && !this.searchTextFormControl.valid) {
            this.invalidemail = true;
        } else {
            this.invalidemail = false;
        }
    }

    addRecipient(event: MatChipInputEvent) {
        const input = event.input;
        const value = input.value;
        input.value = '';

        if (value && this.searchTextFormControl.valid && !this.addedFromAutoComplete) {
            this.invalidemail = false;
            this.recipientsList.push(value);
            this.notifyChangeListener();
        } else if (!this.addedFromAutoComplete && !this.searchTextFormControl.valid) {
            this.invalidemail = true;
        }

        this.addedFromAutoComplete = false;
    }
}
