import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-5xl flex-col items-start justify-center px-6">
      <p className="font-mono text-xs tracking-[0.2em] text-gold uppercase">404</p>
      <h1 className="mt-4 font-serif text-5xl">Page not found.</h1>
      <Link href="/" className="mt-8 text-sm text-blue underline-offset-4 hover:underline">
        Back home
      </Link>
    </section>
  );
}
