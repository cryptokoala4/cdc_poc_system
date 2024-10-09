import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { MenuItemsService } from '../services/menu-items.service';
import { MenuItem } from '../entities/menu-item.entity';

@Resolver(() => MenuItem)
export class MenuItemsResolver {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Query(() => [MenuItem])
  async menuItems(): Promise<MenuItem[]> {
    return this.menuItemsService.findAll();
  }

  @Query(() => MenuItem, { nullable: true })
  async menuItem(
    @Args('_id', { type: () => ID }) _id: string,
  ): Promise<MenuItem | null> {
    return this.menuItemsService.findOne(_id);
  }
}
