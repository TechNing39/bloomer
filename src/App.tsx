import { useState } from 'react';

const shops=[
  {id:1,name:'꽃피는 봄날',address:'서울시 마포구'},
  {id:2,name:'장미정원',address:'서울시 강남구'},
  {id:3,name:'튤립하우스',address:'서울시 송파구'},
];

function FlowerShopCard({name, address,isSelected,onClick,}:{name: string, address: string;isSelected: boolean;onClick: () => void;}) {
  return(
    <div onClick={onClick} style={{ border: isSelected ? '2px solid orange' : '1px solid gray', cursor: 'pointer', padding: '10px', margin: '8px' }}>
      <h2>{name}</h2>
      <p>{address}</p>
    </div>
  )
}

export default function App() {
  const [selectedId, setSelectedId] = useState(0);
  return (
    <div>
      <h1>동네 꽃집 찾기</h1>
      {shops.map((shop)=>(
        <FlowerShopCard
        key={shop.id}
        name={shop.name}
        address={shop.address}
        isSelected={selectedId === shop.id}
        onClick={() => setSelectedId(shop.id)}
      />
        ))}
    </div>
  );
}