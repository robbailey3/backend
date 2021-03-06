import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BlogService } from '../../../../blog/blog.service';

declare var tinymce: any;

@Component({
  selector: 'rb-tinymce',
  templateUrl: './tinymce.component.html',
  styleUrls: ['./tinymce.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TinymceComponent),
      multi: true
    }
  ]
})
export class TinymceComponent implements ControlValueAccessor {
  @Input() inline = false;
  @Input() value: string;
  onChange;
  public settings = {
    height: 400,
    plugins: `print preview searchreplace autolink directionality emoticons
      visualblocks visualchars fullscreen image link template table codesample
    charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists
      wordcount imagetools textpattern help code`,
    toolbar: `formatselect | bold italic strikethrough underline
      | link image media codesample | alignleft aligncenter
      alignright alignjustify  | numlist bullist outdent indent | removeformat code`,
    image_caption: true,
    codesample_languages: [
      { text: 'HTML/XML', value: 'markup' },
      { text: 'JavaScript', value: 'javascript' },
      { text: 'Typescript', value: 'typescript' },
      { text: 'CSS', value: 'css' },
      { text: 'SCSS', value: 'scss' },
      { text: 'PHP', value: 'php' },
      { text: 'Python', value: 'python' },
      { text: 'Java', value: 'java' },
      { text: 'C', value: 'c' },
      { text: 'C#', value: 'csharp' },
      { text: 'C++', value: 'cpp' }
    ],
    style_formats: [
      { title: 'code', block: 'pre', inline: 'code', classes: 'prettyprint' }
    ],
    style_formats_merge: true,
    images_upload_handler: (blobInfo, success, error) => {
      const formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());
      this.blogService.postBlogImage(formData).subscribe(
        (res: any) => {
          success(res['uploads'][0].file);
        },
        (err: any) => {
          error(err);
        }
      );
    },
    automatic_uploads: true,
    file_picker_types: 'image'
  };
  constructor(private blogService: BlogService) {}
  writeValue(value: string): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {}

  change($event) {
    this.onChange(this.value);
  }
}
