'use client';

import { safeIPFSFetch } from "@/app/helpers/ipfsUtils";
import { FC, useEffect, useState } from "react";
import LoadingState from "../Helper/LoadingState";

interface CandidateData {
  name: string;
  description: string;
}

interface CandidateDescriptionProps {
  IpfsHash: string;
}

const CandidateDescription: FC<CandidateDescriptionProps> = ({ IpfsHash }) => {
  const [ipfsFile, setIpfsFile] = useState<CandidateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const getIpfsFile = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Use our safe IPFS fetch with fallback
        const defaultData = { name: "Candidate", description: "Description unavailable" };
        const data = await safeIPFSFetch<CandidateData>(IpfsHash, defaultData);
        
        setIpfsFile(data);
      } catch (error) {
        console.error("Failed to fetch candidate description:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getIpfsFile();
  }, [IpfsHash]);

  if (isLoading) {
    return <LoadingState size="small" />;
  }

  if (hasError) {
    return <p className="text-red-500 italic text-sm">Unable to load candidate information</p>;
  }

  return <p>{ipfsFile?.description || "No description available"}</p>;
};

export default CandidateDescription;
