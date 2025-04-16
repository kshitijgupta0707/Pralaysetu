//step 1: Create an instance of the Facebook provider object 
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from "@/firebase";
import { useAuthStore } from "@/store/useAuthstore";
import toast from "react-hot-toast";
import { auth } from "@/firebase"

export const SignInWithFacebook = () => {
  const { loginwithOAuth } = useAuthStore(); // Reuse same function assuming it handles OAuth users

  async function facebookLogin() {
    const provider = new FacebookAuthProvider();
    // auth.languageCode = 'it';
    // To apply the default browser preference instead of explicitly setting it.
    auth.useDeviceLanguage();

    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      console.log("User = ", user)

      // if (user) {
      await loginwithOAuth({ email: user.email }); // sending to backend
      // toast.success("Signed in successfully!");
      // }
    } catch (error) {
      toast.error("Facebook sign in failed. Please try again.");
      console.error("Facebook sign in error:", error);
    }
  }

  return (
    <div className="mb-2 flex flex-col items-center text-[15px]">
      <button
        onClick={facebookLogin}
        className="flex items-center justify-center gap-3 w-full max-w-xs py-3 px-4 bg-white text-gray-700 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 320 512"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#1877F2"
            d="M279.14 288l14.22-92.66h-88.91V127.89c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S293.25 0 262.36 0c-73.22 0-121.36 44.38-121.36 124.72v70.62H89.09V288h51.91v224h100.17V288z"
          />
        </svg>
        <span className="font-medium">Sign in with Facebook</span>
      </button>
    </div>
  );
};
