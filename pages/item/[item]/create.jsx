import React, { useState, useEffect } from "react";
import "tippy.js/dist/tippy.css"; // optional
import { withAuth } from "../../../components/hocs/withAuth";
import Meta from "../../../components/Meta";
import EditorComponent from "../../../components/editor/EditorConvertToHTML";
import { useRouter } from "next/router";
import axios from "axios";

const Create = () => {
  const router = useRouter();

  const sub = router.query.item;
  console.log("섭 이름 !", sub);

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = async () => {
    console.log("content 들어간다!", content);
    await axios.post(`/post`, {
      title,
      content,
      sub,
    });
    // if (postId) {
    //   //기존 게시글 업데이트
    //   await api.updatePost({ postId, description, htmlContent });
    //   //history.push(`/@${user.name}/post/${postId}`);
    // } else {
    //   //새로운 게시글 생성
    //   await api.createNewPost({ content });
    // }
  };

  return (
    <div>
      <Meta title="Givou" />
      {/* <!-- Create --> */}
      <section className="relative py-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
          />
        </picture>
        <div className="container">
          <h3 className="font-display text-jacarta-700 py-16 text-center text-2xl font-medium dark:text-white">
            글 작성하기
          </h3>

          <div className="mx-auto max-w-[48.125rem]">
            {/* <!-- Name --> */}
            <div className="mb-6">
              <label
                htmlFor="item-name"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                제목<span className="text-red">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                id="item-name"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                placeholder="Item name"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="item-description"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                글 작성
              </label>
              <p className="dark:text-jacarta-300 text-2xs mb-3">
                The description will be included on the {"item's"} detail page
                underneath its image. Markdown syntax is supported.
              </p>

              {/* <EditorConvertToHTML
                theme={"snow"}
                id={"description"}
                placeholder={"설명을 입력해주세요"}
                value={values.description}
                modules={modules}
                formats={formats}
                onChange={(event) => setFieldValue("description", event)}
              /> */}
              <EditorComponent setContent={setContent} content={content} />
            </div>

            {/* <!-- Unlockable Content --> */}
            {/* <div className="dark:border-jacarta-600 border-jacarta-100 relative border-b py-6">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-accent mr-2 mt-px h-4 w-4 shrink-0"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M7 10h13a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 0 1 13.262-3.131l-1.789.894A5 5 0 0 0 7 9v1zm-2 2v8h14v-8H5zm5 3h4v2h-4v-2z" />
                  </svg>

                  <div>
                    <label className="font-display text-jacarta-700 block dark:text-white">
                      Unlockable Content
                    </label>
                    <p className="dark:text-jacarta-300">
                      Include unlockable content that can only be revealed by
                      the owner of the item.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  value="checkbox"
                  name="check"
                  className="checked:bg-accent checked:focus:bg-accent checked:hover:bg-accent after:bg-jacarta-400 bg-jacarta-100 relative h-6 w-[2.625rem] cursor-pointer appearance-none rounded-full border-none after:absolute after:top-[0.1875rem] after:left-[0.1875rem] after:h-[1.125rem] after:w-[1.125rem] after:rounded-full after:transition-all checked:bg-none checked:after:left-[1.3125rem] checked:after:bg-white focus:ring-transparent focus:ring-offset-0"
                />
              </div>
            </div> */}

            {/* <!-- Submit --> */}
            <button
              className="bg-accent-lighter cursor-default rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
              onClick={handleSubmit}
            >
              Create
            </button>
          </div>
        </div>
      </section>
      {/* <!-- end create --> */}
    </div>
  );
};

export default withAuth(Create);
