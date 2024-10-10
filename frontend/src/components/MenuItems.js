'use client'

import { useQuery, gql } from "@apollo/client";

const GET_MENU_ITEMS = gql`
  query {
    menuItems {
      _id
      name
      price
    }
  }
`;

export default function MenuItems() {
  const { loading, error, data } = useQuery(GET_MENU_ITEMS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Sushi Menu</h2>
      <ul>
        {data.menuItems.map((item) => (
          <li key={item._id}>
            <h3>{item.name}</h3>
            <p>Price: ${item.price.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}