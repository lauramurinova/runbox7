// --------- BEGIN RUNBOX LICENSE ---------
// Copyright (C) 2016-2019 Runbox Solutions AS (runbox.com).
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

import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from "@angular/core/testing";
import {DebugElement} from "@angular/core";
import {HeaderToolbarComponent} from "./headertoolbar.component";
import {Router} from "@angular/router";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule, MatDividerModule, MatExpansionModule, MatGridListModule, MatIconModule,
    MatMenuModule,
    MatRadioModule, MatToolbarModule, MatTooltipModule
} from "@angular/material";
import {ResizerModule} from "../directives/resizer.module";
import {RouterTestingModule} from "@angular/router/testing";
import {MessageContents, RunboxWebmailAPI} from "../rmmapi/rbwebmail";
import {Observable, of} from "rxjs";
import {LogoutService} from "../login/logout.service";

describe('HeaderToolbarComponent', () => {

    let component: HeaderToolbarComponent;
    let fixture: ComponentFixture<HeaderToolbarComponent>;
    let de: DebugElement;
    let router: Router;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ HeaderToolbarComponent ],
            imports: [
                MatButtonModule,
                MatIconModule,
                MatMenuModule,
                MatToolbarModule,
                RouterTestingModule.withRoutes([]),
            ],
            providers: [
                {provide: LogoutService},
                {
                    provide: RunboxWebmailAPI, useValue: {
                        getMessageContents(messageId: number): Observable<MessageContents> {
                            console.log('Get message contents for', messageId);
                            return of({
                                mid: messageId,
                                headers: {
                                    from: {
                                        value: 'test@runbox.com'
                                    },
                                    date: new Date(2016, 0, 1).toJSON(),
                                    subject: 'Test subject'
                                },
                                text: {
                                    text: 'blablabla',
                                    html: null,
                                    textAsHtml: null
                                },
                                attachments: [
                                    {
                                        filename: 'test.jpg',
                                        contentType: 'image/jpeg'
                                    },
                                    {
                                        filename: 'test2.png',
                                        contentType: 'image/png',
                                        content: Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8])
                                    }
                                ]
                            });
                        }
                    }
                }
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        router = TestBed.get(Router);
        fixture = TestBed.createComponent(HeaderToolbarComponent);
        router.initialNavigation();
        component = fixture.componentInstance;
        de = fixture.debugElement;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to compose', () => {
        const component = fixture.componentInstance;
        const navigateSpy = spyOn(router, 'navigate');

        component.compose();
        expect(navigateSpy).toHaveBeenCalledWith(['compose']);
    });

    it('should navigate to contacts', () => {
        const component = fixture.componentInstance;
        const navigateSpy = spyOn(router, 'navigate');

        component.contacts();
        expect(navigateSpy).toHaveBeenCalledWith(['contacts']);
    });

    it('should navigate to home', () => {
        const component = fixture.componentInstance;
        const navigateSpy = spyOn(router, 'navigate');

        component.mailtable();
        expect(navigateSpy).toHaveBeenCalledWith(['']);
    });
});