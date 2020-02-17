import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPage } from './create-new.page';

describe('CreateNewPage', () => {
  let component: CreateNewPage;
  let fixture: ComponentFixture<CreateNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
