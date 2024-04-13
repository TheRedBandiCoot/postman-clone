import { Skeleton } from './components/ui/skeleton';

const Loader = () => {
  return (
    <div className="w-[70%] self-center">
      <div className="bg-transparent rounded-md p-4">
        {/* Top row with 3 elements */}
        <Skeleton className="h-8 w-32  rounded-lg mb-4"></Skeleton>
        <div className="flex space-x-4 mb-4">
          <Skeleton className="h-5 w-20  rounded-lg"></Skeleton>
          <Skeleton className="h-5 w-20  rounded-lg"></Skeleton>
          <Skeleton className="h-5 w-20  rounded-lg"></Skeleton>
        </div>

        {/* Middle row with 2 elements */}
        <div className="flex space-x-4 bg-slate-700 p-5 rounded mb-4">
          <Skeleton className="h-10 w-full  rounded"></Skeleton>
          <Skeleton className="h-10 w-full  rounded"></Skeleton>
        </div>

        {/* Bottom large element */}
        <Skeleton className="h-24 w-full bg-slate-700 rounded"></Skeleton>
      </div>
    </div>
  );
};

export default Loader;
