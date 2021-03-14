import React from "react";

const ProductItem = (props) => {
  const { product } = props;
  return (
    <div className="column is-half">
      <div className="box">
        <div className="media">
          <div className="media-left">
            <figure className="image is-64x64">
              <image
                alt={product.shortDesc}
                src="https://bulma.io/images/placeholders/128x128.png"
              />
            </figure>
          </div>
          <div className="media-content">
            <b>
              {product.name}{" "}
              <span className="tag is-primary">{product.price}</span>
            </b>
            <div>{product.shortDesc}</div>
            {product.stock > 0 ? (
              <small>{`${product.stock} عدد موجود است`}</small>
            ) : (
              <small>موجود نیست</small>
            )}
            <div className="is-clearfix">
              <button
                onClick={() =>
                  props.addToCart({
                    id: product.name,
                    product,
                    amount: 1,
                  })
                }
                className="button is-small is-outlined is-primary   is-pulled-right"
              >
                افزودن به سبد خرید
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
