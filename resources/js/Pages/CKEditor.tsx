import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Button } from 'antd';

import {
	ClassicEditor,
	Autoformat,
	Bold,
	Italic,
	Underline,
	BlockQuote,
	Base64UploadAdapter,
	CKFinder,
	CKFinderUploadAdapter,
	CloudServices,
	CKBox,
	Essentials,
	Heading,
	Image,
	ImageCaption,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	PictureEditing,
	Indent,
	IndentBlock,
	Link,
	List,
	MediaEmbed,
	Mention,
	Paragraph,
	PasteFromOffice,
	Table,
	TableColumnResize,
	TableToolbar,
	TextTransformation,
    Undo

} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
//import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

function App() {



    const handleClick =(): void => {

    }


    return (

        <div className='min-h-screen flex justify-center items-center'>

            <div className='w-full mx-2 md:w-[730px]'>
                <CKEditor
                    editor={ ClassicEditor }
                    config={ {
                        toolbar: {
                            items: [ 
                                'undo',
                                'redo',
                                '|',
                                'heading',
                                '|',
                                'bold',
                                'italic',
                                'underline',
                                '|',
                                'link',
                                'uploadImage',
                                'resizeImage',
                                'ckbox',
                                'blockQuote',
                                'mediaEmbed',
                                '|',
                                'bulletedList',
                                'numberedList',
                                '|',
                                'outdent',
                                'indent',
                            ],
                        },

                        heading: {
                            options: [
                                {
                                    model: 'paragraph',
                                    title: 'Paragraph',
                                    class: 'ck-heading_paragraph',
                                },
                                {
                                    model: 'heading1',
                                    view: 'h1',
                                    title: 'Heading 1',
                                    class: 'ck-heading_heading1',
                                },
                                {
                                    model: 'heading2',
                                    view: 'h2',
                                    title: 'Heading 2',
                                    class: 'ck-heading_heading2',
                                },
                                {
                                    model: 'heading3',
                                    view: 'h3',
                                    title: 'Heading 3',
                                    class: 'ck-heading_heading3',
                                },
                                {
                                    model: 'heading4',
                                    view: 'h4',
                                    title: 'Heading 4',
                                    class: 'ck-heading_heading4',
                                },
                            ],
                        },

                        image: {
                            resizeOptions: [
                                {
                                    name: 'resizeImage:original',
                                    label: 'Default image width',
                                    value: null,
                                },
                                {
                                    name: 'resizeImage:50',
                                    label: '50% page width',
                                    value: '50',
                                },
                                {
                                    name: 'resizeImage:75',
                                    label: '75% page width',
                                    value: '75',
                                },
                            ],
                            toolbar: [
                                'imageTextAlternative',
                                'toggleImageCaption',
                                '|',
                                'imageStyle:inline',
                                'imageStyle:wrapText',
                                'imageStyle:breakText',
                                '|',
                                'resizeImage',
                            ],
                        },

                        link: {
                            addTargetToExternalLinks: true,
                            defaultProtocol: 'https://',
                        },
                        table: {
                            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
                        },
                       
                        plugins: [
                            Autoformat,
                            BlockQuote,
                            Bold,
                            CKFinder,
                            CKFinderUploadAdapter,
                            CloudServices,
                            Essentials,
                            Heading,
                            Image,
                            ImageCaption,
                            ImageResize,
                            ImageStyle,
                            ImageToolbar,
                            ImageUpload,
                            Base64UploadAdapter,
                            Indent,
                            IndentBlock,
                            Italic,
                            Link,
                            List,
                            MediaEmbed,
                            Mention,
                            Paragraph,
                            PasteFromOffice,
                            PictureEditing,
                            Table,
                            TableColumnResize,
                            TableToolbar,
                            TextTransformation,
                            Underline,
                        ],
                        //licenseKey: '<YOUR_LICENSE_KEY>',
                        // mention: { 
                        //     // Mention configuration
                        // },
                        initialData: '<p>Hello from CKEditor 5 in React!</p>',
                    } }
                />

                <div className='flex justify-end mt-4'>
                    <Button onClick={handleClick} className='primary-button font-bold'>SAVE</Button>
                </div>
            </div>
        </div>
        
    );
}

export default App;
