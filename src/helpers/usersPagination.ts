import { UserModel } from "@models";
import { PaginationData } from "@types";

export const usersPagination = async (paginationData: PaginationData) => {
  const { limit, page, skip } = paginationData;
  
  try {
    const totalUsers: number = await UserModel.countDocuments();
    const totalPages: number = Math.ceil(totalUsers / limit);
    const usersByPage: number = (limit > totalUsers) ? totalUsers : limit;
    const currentPage: number = page;
    const currentUsersQuantity: number = ((limit * page) > totalUsers) ? totalUsers : (limit * page);
    const users = await UserModel
      .find({})
      .select("-password -createdAt -updatedAt")
      .populate("role", "-createdAt -updatedAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
    
    return {
      users,
      totalUsers,
      usersByPage,
      currentUsersQuantity,
      currentPage,
      totalPages,
    };
  } catch (error: any) {
    throw new Error("Error fetching paginated Users.");
  };
};
