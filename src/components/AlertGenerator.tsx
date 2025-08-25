import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Megaphone, Send, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  category: string;
  timestamp: Date;
  status: 'draft' | 'sent' | 'scheduled';
}

export const AlertGenerator = () => {
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState<'info' | 'warning' | 'critical'>('info');
  const [category, setCategory] = useState('');
  const [copiedAlert, setCopiedAlert] = useState('');
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'Emergency Shelter Update',
      message: 'VERIFIED: Emergency shelters have available capacity. Red Cross confirms 300+ beds still available across 5 locations. Contact 311 for shelter assignment.',
      severity: 'critical',
      category: 'Emergency Response',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'sent'
    },
    {
      id: '2',
      title: 'Water Safety Clarification',
      message: 'FACT CHECK: Claims of city-wide water contamination are FALSE. Water testing shows no contamination in 90% of areas. Boil-water advisory only for Downtown District zones 1-3.',
      severity: 'warning',
      category: 'Public Health',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'sent'
    }
  ]);
  
  const { toast } = useToast();

  const generateAlert = () => {
    if (!alertTitle.trim() || !alertMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and message for the alert",
        variant: "destructive",
      });
      return;
    }

    const newAlert: Alert = {
      id: Date.now().toString(),
      title: alertTitle,
      message: alertMessage,
      severity,
      category: category || 'General',
      timestamp: new Date(),
      status: 'sent'
    };

    setRecentAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
    
    // Clear form
    setAlertTitle('');
    setAlertMessage('');
    setCategory('');
    
    toast({
      title: "Alert Generated",
      description: "Public alert has been generated and distributed",
      variant: "default",
    });
  };

  const copyAlert = (alert: Alert) => {
    const alertText = `🚨 ${alert.title.toUpperCase()}\n\n${alert.message}\n\n⏰ ${alert.timestamp.toLocaleString()}\n📍 Category: ${alert.category}`;
    navigator.clipboard.writeText(alertText);
    setCopiedAlert(alert.id);
    setTimeout(() => setCopiedAlert(''), 2000);
    
    toast({
      title: "Copied to Clipboard",
      description: "Alert text copied for sharing",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'warning';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Megaphone className="h-4 w-4" />;
    }
  };

  // Quick templates for common scenarios
  const quickTemplates = [
    {
      title: 'Misinformation Correction',
      message: 'FACT CHECK: Recent claims about [TOPIC] are FALSE. Verified information: [CORRECTION]. Source: [AUTHORITY]. For updates: [CONTACT].',
      severity: 'warning' as const,
      category: 'Fact Check'
    },
    {
      title: 'Emergency Resource Update',
      message: 'VERIFIED UPDATE: [RESOURCE] availability confirmed. Current status: [STATUS]. Contact [CONTACT] for assistance.',
      severity: 'critical' as const,
      category: 'Emergency Response'
    },
    {
      title: 'Safety Advisory',
      message: 'SAFETY NOTICE: [SITUATION] update. Public advised to [ACTION]. Official sources: [AUTHORITIES].',
      severity: 'info' as const,
      category: 'Public Safety'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Megaphone className="h-5 w-5" />
            <span>Emergency Alert Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Alert Title</label>
              <Input
                placeholder="Brief, clear title for the alert"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Category</label>
              <Input
                placeholder="e.g., Emergency Response, Public Health"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Severity Level</label>
            <Select value={severity} onValueChange={(value: any) => setSeverity(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info - General Update</SelectItem>
                <SelectItem value="warning">Warning - Important Notice</SelectItem>
                <SelectItem value="critical">Critical - Urgent Action Required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Alert Message</label>
            <Textarea
              placeholder="Clear, factual message with verified information and sources"
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={generateAlert} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Generate & Send Alert
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickTemplates.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left justify-start"
                onClick={() => {
                  setAlertTitle(template.title);
                  setAlertMessage(template.message);
                  setSeverity(template.severity);
                  setCategory(template.category);
                }}
              >
                <div>
                  <div className="font-medium text-sm">{template.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {template.message.slice(0, 50)}...
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Public Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getSeverityColor(alert.severity) as any} className="flex items-center space-x-1">
                      {getSeverityIcon(alert.severity)}
                      <span>{alert.severity.toUpperCase()}</span>
                    </Badge>
                    <Badge variant="outline">{alert.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyAlert(alert)}
                  >
                    {copiedAlert === alert.id ? (
                      <Check className="h-4 w-4 text-verified" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <h4 className="font-medium">{alert.title}</h4>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};