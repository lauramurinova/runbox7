import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftDeskComponent } from './draftdesk.component';

describe('DraftDeskComponent', () => {
    let component: DraftDeskComponent;
    let fixture: ComponentFixture<DraftDeskComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DraftDeskComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DraftDeskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});