import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostPageComponent } from './create-post-page.component';

describe('CreatePostPageComponent', () => {
  let component: CreatePostPageComponent;
  let fixture: ComponentFixture<CreatePostPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePostPageComponent]
    });
    fixture = TestBed.createComponent(CreatePostPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
