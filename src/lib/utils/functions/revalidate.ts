import { revalidatePath, revalidateTag } from "next/cache";

export const revalidate = {
  paths: (paths: string[]) => {
    paths.forEach((path) => {
      revalidatePath(path);
    });

    return true;
  },

  tags: (tags: string[]) => {
    tags.forEach((tag) => {
      revalidateTag(tag);
    });

    return true;
  },
};
