import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '@db/prisma.service';
import { toBoolean } from '@utils/function.utils';
import { category } from 'generated/prisma/client';
import { paginationResponse, paginationSolver } from '@utils/pagination';
import { PaginationDto } from '@common/dtos/pagination.dto';
import { categoryWhereInput } from 'generated/prisma/models';
import { Message } from '@common/enums/message.enum';
import { mergeUpdateData } from '@utils/mergeUpdateData';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { image, show, slug, title, parentId } = createCategoryDto;

    const category = await this.findOneBySlug(slug);

    if (category) throw new ConflictException('دسته بندی با این slug موجود می باشد');

    let parent: null | category = null;
    if (parentId) {
      parent = await this.findOneById(parentId);
    }

    await this.prisma.category.create({
      data: { image, show: toBoolean(show), slug, title, parentId: parent?.id },
    });

    return { message: Message.Created };
  }

  async findAll(paginationDto: PaginationDto) {
    const { take, skip, page } = paginationSolver(paginationDto);

    const where: categoryWhereInput = { parentId: null };

    const count = await this.prisma.category.count({ where });

    const categories = await this.prisma.category.findMany({
      skip,
      take,
      where,
      include: {
        parent: true,
      },
      orderBy: { id: 'desc' },
    });

    return paginationResponse({
      count,
      page,
      take,
      data: categories,
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { slug, parentId } = updateCategoryDto;

    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('دسته بندی یافت نشد');

    if (slug && slug !== category.slug) {
      const hasCategorySlug = await this.findOneBySlug(slug);
      if (hasCategorySlug) {
        throw new ConflictException('دسته بندی با این slug موجود می باشد');
      }
    }

    // بررسی parentId
    if (parentId !== undefined) {
      if (parentId === id) {
        throw new ConflictException('دسته بندی نمی‌تواند والد خودش باشد');
      }

      if (parentId) {
        const parent = await this.prisma.category.findUnique({
          where: { id: parentId },
        });
        if (!parent) {
          throw new NotFoundException('دسته بندی والد یافت نشد');
        }
      }
    }

    const updateData = mergeUpdateData(updateCategoryDto, category);

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        parent: true,
        children: true,
      },
    });

    return {
      message: Message.Updated,
      data: updatedCategory,
    };
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('دسته بندی یافت نشد');

    await this.prisma.category.delete({ where: { id } });

    return { message: Message.Deleted };
  }

  async findBySlug(slug: string) {
    const category = await this.findOneBySlug(slug);

    if (!category) throw new NotFoundException('یافت نشد');

    return category;
  }

  async findOneById(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    return category;
  }

  async findOneBySlug(slug: string) {
    return await this.prisma.category.findFirst({
      where: { slug },
      include: { children: { include: { children: true } }, parent: true },
    });
  }
}
