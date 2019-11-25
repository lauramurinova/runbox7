import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailRecipientInputComponent } from './mailrecipientinput.component';

describe('MailRecipientInputComponent', () => {
    let component: MailRecipientInputComponent;
    let fixture: ComponentFixture<MailRecipientInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MailRecipientInputComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MailRecipientInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});