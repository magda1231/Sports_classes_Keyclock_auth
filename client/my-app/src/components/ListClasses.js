import Class from "./Class";

const ListProducts = ({ lista }) => {
  return (
    <div>
      {lista.map((x, el) => (
        <Class obj={x} key={el} />
      ))}
    </div>
  );
};

export default ListProducts;
