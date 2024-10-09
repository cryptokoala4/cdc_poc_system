import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MenuItemsService } from '../services/menu-items.service';
import { MenuItem } from '../entities/menu-item.entity';
import { CreateMenuItemInput } from '../dto/create-menu-item.input';
import { UpdateMenuItemInput } from '../dto/update-menu-item.input';

@Resolver(() => MenuItem)
export class MenuItemsResolver {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Query(() => [MenuItem])
  async menuItems(): Promise<MenuItem[]> {
    return this.menuItemsService.findAll();
  }

  @Query(() => MenuItem)
  async menuItem(@Args('_id') _id: string): Promise<MenuItem> {
    return this.menuItemsService.findOne(_id);
  }

  @Mutation(() => MenuItem)
  async createMenuItem(
    @Args('createMenuItemInput') createMenuItemInput: CreateMenuItemInput,
  ): Promise<MenuItem> {
    return this.menuItemsService.create(createMenuItemInput);
  }

  @Mutation(() => MenuItem)
  async updateMenuItem(
    @Args('updateMenuItemInput') updateMenuItemInput: UpdateMenuItemInput,
  ): Promise<MenuItem> {
    return this.menuItemsService.update(
      updateMenuItemInput._id,
      updateMenuItemInput,
    );
  }

  @Mutation(() => MenuItem)
  async removeMenuItem(@Args('_id') _id: string): Promise<MenuItem> {
    return this.menuItemsService.remove(_id);
  }
}
