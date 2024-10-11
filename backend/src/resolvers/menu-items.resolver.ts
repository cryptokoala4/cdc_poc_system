import { Resolver, Query, Args, ID, ObjectType, Field } from '@nestjs/graphql';
import { MenuItemsService } from '../services/menu-items.service';
import { MenuItem } from '../entities/menu-item.entity';

@ObjectType()
class MenuItemOperationResult {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => MenuItem, { nullable: true })
  menuItem: MenuItem | null;
}

@Resolver(() => MenuItem)
export class MenuItemsResolver {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Query(() => [MenuItem])
  async menuItems() {
    const response = await this.menuItemsService.findAll();
    return response.data;
  }

  @Query(() => MenuItemOperationResult)
  async menuItem(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<MenuItemOperationResult> {
    const response = await this.menuItemsService.findOne(id);
    return {
      success: !!response.data,
      message: response.data
        ? 'MenuItem found successfully'
        : `MenuItem with ID ${id} not found`,
      menuItem: response.data,
    };
  }
}
