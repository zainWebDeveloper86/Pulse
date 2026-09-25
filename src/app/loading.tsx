/**
 * Skeleton structure loading
 */

// export default function Loading() {
//   return (
//     <div className="flex min-h-screen flex-col bg-dark-1 px-6 py-10">
//       {/* Header Skeleton */}
//       <div className="mx-auto w-full max-w-4xl">
//         <div className="h-8 w-48 animate-pulse rounded-md bg-dark-3" />

//         {/* Feed Skeleton */}
//         <div className="mt-8 flex flex-col gap-6">
//           {[1, 2, 3].map((i) => (
//             <div
//               key={i}
//               className="rounded-xl bg-dark-2 p-7"
//             >
//               <div className="flex items-start gap-4">
//                 {/* Avatar Skeleton */}
//                 <div className="h-11 w-11 animate-pulse rounded-full bg-dark-4" />

//                 {/* Content Skeleton */}
//                 <div className="flex-1 flex-col gap-3">
//                   <div className="h-4 w-32 animate-pulse rounded bg-dark-4" />
//                   <div className="mt-3 h-4 w-full animate-pulse rounded bg-dark-4" />
//                   <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-dark-4" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-1 px-6">
      {/* Animated Logo */}
      <div className="flex items-center gap-2">
        <h1 className="animate-pulse font-mono text-3xl font-bold text-light-1">
          Pulse
        </h1>
        <span className="animate-pulse text-3xl font-bold text-primary-500">
          .
        </span>
      </div>

      {/* Spinner */}
      <div className="mt-8 h-8 w-8 animate-spin rounded-full border-4 border-dark-4 border-t-primary-500" />

      {/* Text */}
      <p className="mt-6 text-base-regular text-light-3">Loading...</p>
    </div>
  );
}
