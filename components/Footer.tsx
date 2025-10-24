export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm md:text-base">
          &copy; {new Date().getFullYear()} 富士山タイプ. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
