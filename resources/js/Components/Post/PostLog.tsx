import React from "react";
import { PostLog } from "@/types";
import dayjs from "dayjs";

const dateFormat = (item: Date): string => {
    return dayjs(item).format("MMM-DD-YYYY hh:mm A");
};

export default function PostLogComponent({ postlogs }: { postlogs: PostLog[] }) {
    return (
        <div className="bg-white mt-4 mx-2 p-6">
			<div className="font-bold text-lg pb-2 mb-2 border-b">POST LOGS</div>
			
			<div className="h-[500px] overflow-auto">
				{postlogs.map((item, index) => (
					<div key={index} className="my-3 border-b">
						<div> <span className="font-bold text-[14px] font-mono">USER: </span> {item.alias}</div>
						<div> <span className="font-bold text-[14px] font-mono">ACTION: </span>{item.description}</div>
						<div> <span className="font-bold text-[14px] font-mono">DATE & TIME: </span>{dateFormat(item.created_at)}</div>
					</div>
				))}
			</div>
            
        </div>
    );
}
