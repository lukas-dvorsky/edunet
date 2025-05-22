export interface PostData {
  id: string;
  title?: string;
  content?: string;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  tagId: string;
  parentTag?: string;
  nestIndex?: number;
  wallId?: string;
}

export interface Data {
  data: PostData;
  refetch?: React.Dispatch<React.SetStateAction<boolean>>;
}
