import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51NZJTgDr1EqLvesSmDtinG4Pp6NacU437C6fpgXm9SXx4LgAxlQelqVGT6bymp4JR91Fzy8SBXsSHUPg9sGYndiQ00RcLiHNtj");
export const Funding = () => {
  return (
    <div className="container mx-auto p-4 relative top-14">
      <h2 className="text-3xl font-bold mb-4 text-center">Give us Fund</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm></CheckoutForm>
      </Elements>

    </div>
  );
};
