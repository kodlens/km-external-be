import dayjs from "dayjs";

export const dateFormat = (item: string): string => {
    return dayjs(new Date(item)).format("MMM-DD-YYYY");
};


export const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
) => {
    e.currentTarget.src = "/img/no-img.png";
};


export const truncate = (text: string, limit: number) => {
    if (text.length > 0) {
        const words = text.split(" ");
        if (words.length > limit) {
            return words.slice(0, limit).join(" ") + "...";
        }
        return text;
    } else {
        return "";
    }
};

