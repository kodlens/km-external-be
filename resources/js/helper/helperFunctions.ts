import dayjs from "dayjs";

export const dateFormat = (item: string): string => {
    return item ? dayjs(new Date(item)).format("MMM-DD-YYYY") : 'No Date';
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

export const formatNumber = (value?: number | null) => {
  if (typeof value !== "number" || isNaN(value)) {
    return "0"
  }
  return new Intl.NumberFormat("en-US").format(value)
}
