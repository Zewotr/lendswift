export default function ErrorMessage({ message, id }) {
  if (!message) return null;
  return (
    <div id={id} role="alert" aria-live="polite" className="mt-1 text-sm text-error">
      {message}
    </div>
  );
}