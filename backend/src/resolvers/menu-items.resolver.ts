import { Resolver, Query } from '@nestjs/graphql';
import { MenuItemsService } from '../services/menu-items.service';
import { MenuItem } from '../models/menu-item.model';

@Resolver(() => MenuItem)
export class MenuItemsResolver {
  constructor(private menuItemsService: MenuItemsService) {}

  @Query(() => [MenuItem])
  async getMenuItems(): Promise<MenuItem[]> {
    return this.menuItemsService.findAll();
  }
}
