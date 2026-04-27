import Link from "next/link";
import StoreDetailAddReview from "./StoreDetailAddReview";

interface Props {
  isLoggedIn?: boolean;
}

const StoreDetailSignInCTA = ({ isLoggedIn = false }: Props) => (
  <section className="py-6 mb-8 border-t border-[#F0F0F0]">
    {isLoggedIn ? (
      <StoreDetailAddReview />
    ) : (
      <div className="border border-[#E0E0E0] rounded-2xl py-8 px-6 text-center">
        <p className="text-sm font-medium text-[#1D1D1D] mb-5">
          Please sign in or sign up to share your review!
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/sign-in"
            className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-8 py-2.5 bg-[#1D1D1D] hover:bg-black text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    )}
  </section>
);

export default StoreDetailSignInCTA;
