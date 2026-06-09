import { ISizeService, ISizeRepository, Query, Size } from "@types";

export class SizeService implements ISizeService {
  private sizeRepository: ISizeRepository;

  constructor(sizeRepository: ISizeRepository) {
    this.sizeRepository = sizeRepository;
  };

  async createSize(size: Size): Promise<Size> {
    return this.sizeRepository.create(size);
  };

  async findSizes(query?: Query): Promise<Size[]> {
    return this.sizeRepository.find(query);
  };

  async findSizeById(id: string): Promise<Size | null> {
    return this.sizeRepository.findById(id);
  };

  async findSizeByName(name: string): Promise<Size | null> {
    return this.sizeRepository.findOne({ name });
  };

  async updateSize(id: string, Size: Partial<Size>): Promise<Size | null> {
    return this.sizeRepository.update(id, Size);
  };

  async deleteSize(id: string): Promise<boolean> {
    return this.sizeRepository.delete(id);
  };
};
