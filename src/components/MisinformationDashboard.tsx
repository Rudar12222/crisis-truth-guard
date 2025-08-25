import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Clock, ExternalLink, Filter, Search, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface MisinformationItem {
  id: string;
  claim: string;
  status: 'unverified' | 'false' | 'verified' | 'investigating';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  correction: string;
  context: string;
  sources: string[];
  timestamp: Date;
  location?: string;
  topic: string;
}

// Mock data for demonstration
const mockData: MisinformationItem[] = [
  {
    id: '1',
    claim: 'Emergency shelters are completely full and not accepting new evacuees',
    status: 'false',
    severity: 'critical',
    source: 'Social Media',
    correction: 'Emergency shelters have available capacity. Red Cross confirms 300+ beds still available across 5 locations.',
    context: 'This false claim could prevent people from seeking necessary shelter during the crisis. Multiple shelters are actively accepting evacuees.',
    sources: ['Red Cross Emergency Response', 'County Emergency Management', 'FEMA Regional Office'],
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    location: 'Metropolitan Area',
    topic: 'Emergency Response'
  },
  {
    id: '2',
    claim: 'Water supply contaminated throughout the city due to infrastructure damage',
    status: 'investigating',
    severity: 'high',
    source: 'Unverified Report',
    correction: 'Investigation ongoing. Current water testing shows no contamination in 90% of areas. Boil-water advisory issued for specific zones only.',
    context: 'Water safety is critical during emergencies. Official testing results will be published hourly.',
    sources: ['City Water Department', 'EPA Regional Lab', 'Health Department'],
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    location: 'Downtown District',
    topic: 'Public Health'
  },
  {
    id: '3',
    claim: 'All major highways closed indefinitely due to severe damage',
    status: 'false',
    severity: 'medium',
    source: 'News Outlet',
    correction: 'Highway 101 and 405 are open with reduced lanes. Only Highway 15 remains closed. Alternative routes available via state roads.',
    context: 'Accurate transportation information is vital for evacuation and supply routes.',
    sources: ['State Department of Transportation', 'Highway Patrol', 'Traffic Management Center'],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    location: 'Regional',
    topic: 'Transportation'
  }
];

export const MisinformationDashboard = () => {
  const [items, setItems] = useState<MisinformationItem[]>(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new misinformation detection
      const topics = ['Emergency Response', 'Public Health', 'Transportation', 'Weather', 'Infrastructure'];
      const statuses: MisinformationItem['status'][] = ['unverified', 'investigating', 'false', 'verified'];
      const severities: MisinformationItem['severity'][] = ['low', 'medium', 'high', 'critical'];
      
      if (Math.random() > 0.7) {
        const newItem: MisinformationItem = {
          id: Date.now().toString(),
          claim: 'New misinformation detected in real-time monitoring',
          status: statuses[Math.floor(Math.random() * statuses.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          source: 'AI Monitoring System',
          correction: 'Fact-checking in progress...',
          context: 'Detected through automated content analysis',
          sources: ['Monitoring System'],
          timestamp: new Date(),
          topic: topics[Math.floor(Math.random() * topics.length)]
        };
        
        setItems(prev => [newItem, ...prev.slice(0, 9)]);
        
        if (newItem.severity === 'critical') {
          toast({
            title: "Critical Misinformation Detected",
            description: "High-priority false information requires immediate attention",
            variant: "destructive",
          });
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [toast]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.claim.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || item.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getStatusColor = (status: MisinformationItem['status']) => {
    switch (status) {
      case 'false': return 'destructive';
      case 'verified': return 'verified';
      case 'investigating': return 'warning';
      default: return 'secondary';
    }
  };

  const getSeverityColor = (severity: MisinformationItem['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const generateAlert = (item: MisinformationItem) => {
    toast({
      title: "Public Alert Generated",
      description: `Alert published for: ${item.claim.slice(0, 50)}...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Crisis Misinformation Monitor</h1>
            <p className="text-muted-foreground">Real-time detection and verification system</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-verified">
            <CheckCircle className="h-4 w-4" />
            <span>System Active</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium">False Claims</p>
                <p className="text-2xl font-bold text-destructive">
                  {items.filter(i => i.status === 'false').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">Investigating</p>
                <p className="text-2xl font-bold text-warning">
                  {items.filter(i => i.status === 'investigating').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-verified" />
              <div>
                <p className="text-sm font-medium">Verified</p>
                <p className="text-2xl font-bold text-verified">
                  {items.filter(i => i.status === 'verified').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Monitored</p>
                <p className="text-2xl font-bold text-primary">{items.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search claims, topics, or sources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Misinformation Feed */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(item.status) as any}>
                      {item.status.toUpperCase()}
                    </Badge>
                    <Badge className={getSeverityColor(item.severity)}>
                      {item.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{item.topic}</Badge>
                    {item.location && (
                      <Badge variant="secondary">{item.location}</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{item.timestamp.toLocaleString()}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => generateAlert(item)}
                  disabled={item.status !== 'false'}
                  className="shrink-0"
                >
                  Generate Alert
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-destructive mb-2">Claim:</h4>
                <p className="text-sm">{item.claim}</p>
              </div>
              
              {item.status === 'false' && (
                <div>
                  <h4 className="font-semibold text-verified mb-2">Fact-Based Correction:</h4>
                  <p className="text-sm">{item.correction}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold mb-2">Context & Impact:</h4>
                <p className="text-sm text-muted-foreground">{item.context}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Trusted Sources:</h4>
                <div className="flex flex-wrap gap-2">
                  {item.sources.map((source, index) => (
                    <div key={index} className="flex items-center space-x-1 text-sm text-primary">
                      <ExternalLink className="h-3 w-3" />
                      <span>{source}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find relevant misinformation reports.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};