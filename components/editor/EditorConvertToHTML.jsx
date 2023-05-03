import dynamic from 'next/dynamic';
// import "react-quill/dist/quill.snow.css";

// const imageHandler = () => {};

// // text editor custom
// const modules = {
//   toolbar: [
//     [{ header: "1" }, { header: "2" }, { font: [] }],
//     [{ size: [] }],
//     ["bold", "italic", "underline", "strike", "blockquote"],
//     [
//       { list: "ordered" },
//       { list: "bullet" },
//       { indent: "-1" },
//       { indent: "+1" },
//     ],
//     ["link", "image", "video"],
//     ["clean"],
//   ],
//   clipboard: {
//     // toggle to add extra line breaks when pasting HTML:
//     matchVisual: false,
//   },
//   // handlers: {
//   //   image: imageHandler,
//   // },
// };

// /*
//  * Quill editor formats
//  * See https://quilljs.com/docs/formats/
//  */
// const formats = [
//   "header",
//   "font",
//   "size",
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "blockquote",
//   "list",
//   "bullet",
//   "indent",
//   "link",
//   "image",
// ];

// const QuillNoSSRWrapper = dynamic(import("react-quill"), {
//   modules: modules,
//   formats: formats,
//   theme: "snow",
//   ssr: false,
//   loading: () => <p>Loading ...</p>,
// });

// export default QuillNoSSRWrapper;

import { useRef, useState, useMemo } from 'react';
import { AxiosError } from 'axios';
import axios from 'axios';

//이렇게 라이브러리를 불러와서 사용하면 됩니다
const ReactQuill = dynamic(
   async () => {
      const { default: RQ } = await import('react-quill');

      return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
   },
   {
      ssr: false,
   },
);

import 'react-quill/dist/quill.snow.css';

const EditorComponent = ({ content, setContent }) => {
   const quillRef = useRef();

   // 이미지를 업로드 하기 위한 함수
   const imageHandler = () => {
      // 파일을 업로드 하기 위한 input 태그 생성
      const input = document.createElement('input');
      const formData = new FormData();
      let url = '';

      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      // 파일이 input 태그에 담기면 실행 될 함수
      input.onchange = async () => {
         const file = input.files;
         if (file !== null) {
            formData.append('img', file[0]);

            // 저의 경우 파일 이미지를 서버에 저장했기 때문에
            // 백엔드 개발자분과 통신을 통해 이미지를 저장하고 불러왔습니다.

            try {
               const res = await axios.post('/post/img', formData);

               // 백엔드 개발자 분이 통신 성공시에 보내주는 이미지 url을 변수에 담는다.
               url = res.data.url;
               console.log('잘보이게 해버리기@@@@@', url);
               if (quillRef.current) {
                  // 현재 Editor 커서 위치에 서버로부터 전달받은 이미지 불러오는 url을 이용하여 이미지 태그 추가
                  const index = quillRef.current.getEditor().getSelection().index;

                  const quillEditor = quillRef.current.getEditor();
                  quillEditor.setSelection(index, 1);

                  quillEditor.clipboard.dangerouslyPasteHTML(
                     index,
                     // TODO : src givou 수정하기
                     // `<img src=${'http://givou.site:7010' + url} alt=${'alt text'} />`,
                     `<img src=${'http://givou.site:7010/img/test%20test.png'} alt=${'alt text'} />`,
                  );
               }

               return { ...res, success: true };
            } catch (error) {
               const err = error;
               return { ...err.response, success: false };
            }
         }
      };
   };

   // quill에서 사용할 모듈을 설정하는 코드 입니다.
   // 원하는 설정을 사용하면 되는데, 저는 아래와 같이 사용했습니다.
   // useMemo를 사용하지 않으면, 키를 입력할 때마다, imageHandler 때문에 focus가 계속 풀리게 됩니다.
   const modules = useMemo(
      () => ({
         toolbar: {
            container: [
               ['bold', 'italic', 'underline', 'strike', 'blockquote'],
               [{ size: ['small', false, 'large', 'huge'] }, { color: [] }],
               [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }, { align: [] }],
               ['image', 'video'],
            ],
            handlers: {
               image: imageHandler,
            },
         },
      }),
      [],
   );

   return (
      <>
         <ReactQuill
            forwardedRef={quillRef}
            value={content}
            onChange={setContent}
            modules={modules}
            theme="snow"
            placeholder="내용을 입력해주세요."
         />
      </>
   );
};

export default EditorComponent;
