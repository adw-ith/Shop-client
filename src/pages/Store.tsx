import storeItems from "../data/items.json";
import { Row, Col } from "react-bootstrap";
import { Item } from "../components/Item";

export function Store() {
  return (
    <>
      <h1>STORE</h1>
      <Row lg={3} md={2} sm={1} className="g-3">
        {storeItems.map((item) => (
          <Col key={item.id}>
            <Item
              id={item.id}
              name={item.name}
              price={item.price}
              imageUrl={item.imgUrl}
            ></Item>
          </Col>
        ))}
      </Row>
    </>
  );
}
