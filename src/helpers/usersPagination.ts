import { UserModel } from "@models";

export const usersPagination = async (skip: number, limit: number) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);
    const users = await UserModel
      .find({})
      .select("-password -createdAt -updatedAt")
      .populate("role", "-createdAt -updatedAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
    

    return {
      totalPages,
      totalUsers,
      users,
    };
  } catch (error: any) {
    throw new Error("Error fetching paginated Users.");
  };
};
