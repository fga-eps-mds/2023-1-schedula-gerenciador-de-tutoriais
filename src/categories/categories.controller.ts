import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  InternalServerErrorException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@UseInterceptors(CacheInterceptor)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findCategories(): Promise<Category[]> {
    return await this.categoriesService.findCategories();
  }

  @Get(':id')
  async findCategoryById(@Param('id') id: string): Promise<Category> {
    return await this.categoriesService.findCategoryById(id);
  }

  @Post()
  async createCategory(@Body() dto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.createCategory(dto);
  }

  @Put(':id')
  async updateCategory(
    @Body() dto: UpdateCategoryDto,
    @Param('id') id: string,
  ): Promise<Category> {
    return await this.categoriesService.updateCategory(dto, id);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    try {
      await this.categoriesService.deleteCategory(id);
      return 'Categoria removida com sucesso';
    } catch (error) {
      if (error.code === '23503') {
        throw new InternalServerErrorException(
          'Não é possível remover categorias associadas a tutoriais',
        );
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
