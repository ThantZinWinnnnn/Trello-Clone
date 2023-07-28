import React from "react";

//icon
import { HeartIcon, PlusIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";

//components
import { Separator } from "../ui/separator";

const BoardSidebarComponent = () => {
  return (
    <section className="w-[250px] border-r-[1px] border-gray-300 h-[calc(100vh-48px)] opacity-95 bg-[#F4F5F7] p-2">
      <h1 className="text-xl font-semibold text-center">Trello Workspace</h1>
      <Separator className="my-4" />
      <section className="pl-5 flex flex-col space-y-3">
        <div className="flex items-center gap-7 text-base  w-[95%] text-black hover:bg-blue-600 hover:text-white py-2 px-2 rounded-sm cursor-pointer">
          <span>
            <svg
              className="w-5 h-5"
              role="presentation"
              focusable="false"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM5 6C5 5.44772 5.44772 5 6 5H10C10.5523 5 11 5.44772 11 6V16C11 16.5523 10.5523 17 10 17H6C5.44772 17 5 16.5523 5 16V6ZM14 5C13.4477 5 13 5.44772 13 6V12C13 12.5523 13.4477 13 14 13H18C18.5523 13 19 12.5523 19 12V6C19 5.44772 18.5523 5 18 5H14Z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
          <p className="font-rubik text-left">Boards</p>
        </div>
        <div className="flex items-center gap-7 text-base  w-[95%] text-black hover:bg-blue-600 hover:text-white py-2 px-2 rounded-sm cursor-pointer">
          <HeartIcon className="w-5 h-5" />
          <p className="font-rubik">HighLights</p>
        </div>
        <div className="flex items-center gap-7 text-base  w-[95%] text-black hover:bg-blue-600 hover:text-white py-2 px-2 rounded-sm cursor-pointer">
          <span>
            <svg
              className="w-5 h-5"
              role="presentation"
              focusable="false"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.5048 5.67168C11.9099 5.32669 11.2374 5.10082 10.5198 5.0267C11.2076 3.81639 12.5085 3 14 3C16.2092 3 18 4.79086 18 7C18 7.99184 17.639 8.89936 17.0413 9.59835C19.9512 10.7953 22 13.6584 22 17C22 17.5523 21.5523 18 21 18H18.777C18.6179 17.2987 18.3768 16.6285 18.0645 16H19.917C19.4892 13.4497 17.4525 11.445 14.8863 11.065C14.9608 10.7218 15 10.3655 15 10C15 9.58908 14.9504 9.18974 14.857 8.80763C15.5328 8.48668 16 7.79791 16 7C16 5.89543 15.1046 5 14 5C13.4053 5 12.8711 5.25961 12.5048 5.67168ZM10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12ZM14 10C14 10.9918 13.639 11.8994 13.0412 12.5984C15.9512 13.7953 18 16.6584 18 20C18 20.5523 17.5523 21 17 21H3C2.44772 21 2 20.5523 2 20C2 16.6584 4.04879 13.7953 6.95875 12.5984C6.36099 11.8994 6 10.9918 6 10C6 7.79086 7.79086 6 10 6C12.2091 6 14 7.79086 14 10ZM9.99999 14C12.973 14 15.441 16.1623 15.917 19H4.08295C4.55902 16.1623 7.02699 14 9.99999 14Z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
          <p className="font-rubik">Members</p>
        </div>
      </section>
      <Separator className="my-6" />
      {/* to make boards array */}

      <section>
        <div className="w-full px-2 flex justify-between items-center">
          <p className="font-rubik">Your boards</p>
          <div className="flex items-center gap-3 group">
            <DotsHorizontalIcon className="w-4 h-4 hidden group-hover:block cursor-pointer" />
            <PlusIcon className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
      </section>
    </section>
  );
};

export default BoardSidebarComponent;
