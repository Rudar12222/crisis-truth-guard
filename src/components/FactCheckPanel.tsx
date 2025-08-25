import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertTriangle, Search, Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FactCheckResult {
  claim: string;
  verdict: 'true' | 'false' | 'partially-true' | 'unverified';
  confidence: number;
  summary: string;
  sources: Array<{
    name: string;
    url: string;
    credibility: 'high' | 'medium' | 'low';
  }>;
  context: string;
  relatedClaims: string[];
}

export const FactCheckPanel = () => {
  const [claim, setClaim] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const { toast } = useToast();

  // Mock fact-checking function
  const checkFact = async (claimText: string): Promise<FactCheckResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock different responses based on content
    if (claimText.toLowerCase().includes('vaccine') || claimText.toLowerCase().includes('5g')) {
      return {
        claim: claimText,
        verdict: 'false',
        confidence: 92,
        summary: 'This claim has been debunked by multiple health authorities and scientific studies.',
        sources: [
          { name: 'WHO Health Advisory', url: '#', credibility: 'high' },
          { name: 'CDC Scientific Review', url: '#', credibility: 'high' },
          { name: 'Medical Journal Research', url: '#', credibility: 'high' }
        ],
        context: 'Misinformation about vaccines and 5G technology often spreads during health crises. Official health organizations provide evidence-based information.',
        relatedClaims: [
          'Similar false claims about vaccine side effects',
          '5G conspiracy theories during pandemic'
        ]
      };
    } else if (claimText.toLowerCase().includes('government') || claimText.toLowerCase().includes('cover')) {
      return {
        claim: claimText,
        verdict: 'unverified',
        confidence: 45,
        summary: 'Insufficient credible evidence to verify this claim. Investigation ongoing.',
        sources: [
          { name: 'Government Response Team', url: '#', credibility: 'high' },
          { name: 'Independent Investigators', url: '#', credibility: 'medium' }
        ],
        context: 'Claims involving government actions require careful verification from multiple independent sources.',
        relatedClaims: [
          'Similar unverified government-related claims'
        ]
      };
    } else {
      return {
        claim: claimText,
        verdict: 'partially-true',
        confidence: 76,
        summary: 'The claim contains some accurate information but lacks important context and contains misleading elements.',
        sources: [
          { name: 'Emergency Management Agency', url: '#', credibility: 'high' },
          { name: 'Local News Verification', url: '#', credibility: 'medium' },
          { name: 'Community Reports', url: '#', credibility: 'low' }
        ],
        context: 'Partial truths can be misleading during crises. Complete and accurate information is essential for public safety.',
        relatedClaims: [
          'Related emergency response claims',
          'Similar partially accurate statements'
        ]
      };
    }
  };

  const handleFactCheck = async () => {
    if (!claim.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a claim to fact-check",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    try {
      const result = await checkFact(claim);
      setResult(result);
      
      toast({
        title: "Fact-Check Complete",
        description: `Verdict: ${result.verdict.toUpperCase()} (${result.confidence}% confidence)`,
        variant: result.verdict === 'false' ? "destructive" : "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete fact-check. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getVerdictIcon = (verdict: FactCheckResult['verdict']) => {
    switch (verdict) {
      case 'true':
        return <CheckCircle className="h-5 w-5 text-verified" />;
      case 'false':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'partially-true':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      default:
        return <Search className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getVerdictColor = (verdict: FactCheckResult['verdict']) => {
    switch (verdict) {
      case 'true': return 'verified';
      case 'false': return 'destructive';
      case 'partially-true': return 'warning';
      default: return 'secondary';
    }
  };

  const getCredibilityColor = (credibility: string) => {
    switch (credibility) {
      case 'high': return 'bg-verified text-verified-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Fact Verification System</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="claim" className="text-sm font-medium block mb-2">
              Enter claim to verify:
            </label>
            <Textarea
              id="claim"
              placeholder="Paste the claim you want to fact-check here..."
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          
          <Button 
            onClick={handleFactCheck}
            disabled={isChecking || !claim.trim()}
            className="w-full"
          >
            {isChecking ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifying with trusted sources...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Fact-Check This Claim
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                {getVerdictIcon(result.verdict)}
                <span>Fact-Check Result</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={getVerdictColor(result.verdict) as any}>
                  {result.verdict.replace('-', ' ').toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  {result.confidence}% Confidence
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Claim Being Verified:</h4>
              <p className="text-sm bg-muted p-3 rounded italic">"{result.claim}"</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Summary:</h4>
              <p className="text-sm">{result.summary}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Verified Sources:</h4>
              <div className="space-y-2">
                {result.sources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-card rounded border">
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{source.name}</span>
                    </div>
                    <Badge className={getCredibilityColor(source.credibility)}>
                      {source.credibility.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Context & Impact:</h4>
              <p className="text-sm text-muted-foreground">{result.context}</p>
            </div>

            {result.relatedClaims.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Related Claims:</h4>
                <ul className="text-sm space-y-1">
                  {result.relatedClaims.map((relatedClaim, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <span>{relatedClaim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex space-x-2 pt-4">
              <Button variant="outline" size="sm">
                View Full Report
              </Button>
              <Button variant="outline" size="sm">
                Generate Public Alert
              </Button>
              <Button variant="outline" size="sm">
                Share Verification
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};