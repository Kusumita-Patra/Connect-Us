import "./TermsPage.css";

function TermsPage() {

  return (

    <div className="termsPage">

      <div className="termsCard">

        <h1>
          Terms & Conditions
        </h1>

        <ul>

          <li>

            If the delivered product does not match the uploaded item
            or contains major undisclosed defects, the customer has
            the right to return the item immediately at the spot.

          </li>

          <li>

            If a seller receives more than 3 verified bad reviews,
            the admin may temporarily suspend or permanently block
            the seller account.

          </li>

          <li>

            In case of returned products, the admin team will freeze
            the product listing for 5 working days for detailed review.

          </li>

          <li>

            If the seller is found guilty after review, the seller
            may receive a warning, listing restriction, or account ban.

          </li>

        </ul>

      </div>

    </div>
  );
}

export default TermsPage;