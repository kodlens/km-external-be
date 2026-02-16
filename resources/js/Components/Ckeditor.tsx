import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  ClassicEditor,
  Alignment,
  Autoformat,
  Bold,
  BalloonToolbar,
  //CKBox,
  Code,
  Italic,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  BlockQuote,
  CloudServices,
  CodeBlock,
  Essentials,
  FindAndReplace,
  Font,
  Heading,
  Highlight,
  HorizontalLine,
  GeneralHtmlSupport,
  AutoImage,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Base64UploadAdapter,
  PictureEditing,
  Indent,
  IndentBlock,
  TextPartLanguage,
  AutoLink,
  Link,
  LinkImage,
  List,
  ListProperties,
  TodoList,
  MediaEmbed,
  Mention,
  PageBreak,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Style,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  WordCount,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import { FormInstance } from 'antd';
import { Info } from "@/types/info";


const Ckeditor = ({ post, form, ckLicense }: { post?: Info, form: FormInstance, ckLicense: string }) => {
  return (
    <>
      <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 mb-2">
        <svg className="h-5 w-5" fill="red" viewBox="0 0 20 20">
          <path d="M9 9h2v6H9V9zm0-4h2v2H9V5z" />
        </svg>
        Please download the image before attaching it to Editor.
      </div>
      <CKEditor
        data={ post?.description ?? ''}
        editor={ClassicEditor}
        onChange={(_, editor) => {
          const data = editor.getData();
          //setEditorData(data);
          form.setFieldsValue({
            description: data,
          });
        }}
        config={{
          toolbar: {
            shouldNotGroupWhenFull: true,
            items: [
              // --- Document-wide tools ----------------------------------------------------------------------
              "undo",
              "redo",
              "|",
              "findAndReplace",
              "selectAll",
              "|",

              // --- "Insertables" ----------------------------------------------------------------------------

              "link",
              "uploadImage",
              "insertTable",
              "blockQuote",
              "mediaEmbed",
              "codeBlock",
              "pageBreak",
              "horizontalLine",
              "specialCharacters",

              // --- Block-level formatting -------------------------------------------------------------------
              "heading",
              "style",
              "|",

              // --- Basic styles, font and inline formatting -------------------------------------------------------
              "bold",
              "italic",
              "underline",
              "strikethrough",
              {
                label: "Basic styles",
                icon: "text",
                items: [
                  "fontSize",
                  "fontFamily",
                  "fontColor",
                  "fontBackgroundColor",
                  "highlight",
                  "superscript",
                  "subscript",
                  "code",
                  "|",
                  "textPartLanguage",
                  "|",
                ],
              },
              "removeFormat",
              "|",

              // --- Text alignment ---------------------------------------------------------------------------
              "alignment",
              "|",

              // --- Lists and indentation --------------------------------------------------------------------
              "bulletedList",
              "numberedList",
              "todoList",
              "|",
              "outdent",
              "indent",
            ],

          },
          balloonToolbar: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'link',
            'highlight',
            'removeFormat'
          ],

          heading: {
            options: [
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              {
                model: "heading1",
                view: "h1",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h2",
                title: "Heading 2",
                class: "ck-heading_heading2",
              },
              {
                model: "heading3",
                view: "h3",
                title: "Heading 3",
                class: "ck-heading_heading3",
              },
              {
                model: "heading4",
                view: "h4",
                title: "Heading 4",
                class: "ck-heading_heading4",
              },
            ],
          },

          image: {
            resizeOptions: [
              {
                name: "resizeImage:original",
                label: "Default image width",
                value: null,
              },
              {
                name: "resizeImage:50",
                label: "50% page width",
                value: "50",
              },
              {
                name: "resizeImage:75",
                label: "75% page width",
                value: "75",
              },
            ],
            toolbar: [
              "imageTextAlternative",
              "toggleImageCaption",
              "|",
              "imageStyle:inline",
              "imageStyle:wrapText",
              "imageStyle:breakText",
              "|",
              "resizeImage",
            ],
          },

          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: "https://",
          },
          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
            ],
          },

          plugins: [

            Alignment,
            Autoformat,
            AutoImage,
            AutoLink,
            BlockQuote,
            BalloonToolbar,
            Bold,
            CloudServices,
            Code,
            CodeBlock,
            Essentials,
            FindAndReplace,
            Font,
            GeneralHtmlSupport,
            Heading,
            Highlight,
            HorizontalLine,
            Image,
            ImageCaption,
            ImageInsert,
            ImageResize,
            ImageStyle,
            ImageToolbar,
            ImageUpload,
            Base64UploadAdapter,
            Indent,
            IndentBlock,
            Italic,
            Link,
            LinkImage,
            List,
            ListProperties,
            MediaEmbed,
            Mention,
            PageBreak,
            Paragraph,
            PasteFromOffice,
            PictureEditing,
            RemoveFormat,
            SpecialCharacters,
            // SpecialCharactersEmoji,
            SpecialCharactersEssentials,
            Strikethrough,
            Style,
            Subscript,
            Superscript,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextPartLanguage,
            TextTransformation,
            TodoList,
            Underline,
            WordCount,
          ],
          licenseKey: ckLicense,
          // mention: {
          //     // Mention configuration
          // },
          initialData: "",
        }}
      />
    </>
  )
}

export default Ckeditor
