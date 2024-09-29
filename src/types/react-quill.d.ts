declare module 'react-quill' {
 import { Component } from 'react';
 import { Delta } from 'quill'; // Quill.js type for Delta

 type QuillSource = 'api' | 'user'; // Quill uses either 'api' or 'user' as the source
 interface QuillEditor {
   getText: () => string;
   getContents: () => Delta;
   // Add more editor methods if needed
 }

 interface ReactQuillProps {
   value: string;
   onChange: (content: string, delta: Delta, source: QuillSource, editor: QuillEditor) => void;
   className?: string;
   // Add more props as needed
 }

 class ReactQuill extends Component<ReactQuillProps> {}
 export default ReactQuill;
}
