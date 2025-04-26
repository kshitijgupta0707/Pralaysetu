
import {  useState } from 'react';

export const TruncatedText = ({ text, maxLength = 80, height=60 , style="" }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text || text.length <= maxLength) {
        return (
            <div className={`min-h-[${height}px]`} style={{ minHeight: `${height}px` }}>
                <p className="text-sm">{text}</p>
            </div>
        );
    }

    return (
        <div>
            <p className={`text-sm ${style}`}>
                {isExpanded ? text : `${text.substring(0, maxLength)}...`}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-1 text-blue-500 font-medium hover:underline focus:outline-none"
                >
                    {isExpanded ? 'Read less' : 'Read more'}
                </button>
            </p>
        </div>
    );
};
