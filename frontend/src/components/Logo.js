import { cn } from '../lib/utils';

export const Logo = ({ className, size = 'default' }) => {
  const sizes = {
    sm: 'w-10 h-10',
    default: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  return (
    <img 
      src="https://customer-assets.emergentagent.com/job_companalyzer-1/artifacts/u5ig6v3m_yuu49tcl_image-removebg-preview.png"
      alt="SITERANK AI Logo"
      className={cn(sizes[size], 'object-contain', className)}
    />
  );
};

export default Logo;
