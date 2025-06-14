import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLeaderboard, LeaderboardEntry } from '@/services/gamification';
import { Trophy, Medal, Award, Users } from 'lucide-react';

export const LeaderboardCard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await getLeaderboard(10);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <div className="w-5 h-5 text-center text-sm font-bold text-muted-foreground">#{rank}</div>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 2:
        return 'bg-gray-400/10 text-gray-600 border-gray-200';
      case 3:
        return 'bg-amber-600/10 text-amber-600 border-amber-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Leaderboard Global
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Leaderboard Global
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              Belum ada data leaderboard
            </div>
          ) : (
            leaderboard.map((entry, index) => {
              const rank = index + 1;
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    rank <= 3 ? 'bg-gradient-to-r from-primary/5 to-background' : 'bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-[60px]">
                    {getRankIcon(rank)}
                    <Badge variant="outline" className={getRankBadgeColor(rank)}>
                      #{rank}
                    </Badge>
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{entry.nickname}</div>
                    <div className="text-sm text-muted-foreground">
                      Level {entry.level} • {entry.totalReads} dzikir
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-primary">{entry.totalXP} XP</div>
                    <div className="text-xs text-muted-foreground">
                      🔥 {entry.streak} hari
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        <div className="text-xs text-center text-muted-foreground mt-4 p-2 bg-muted/50 rounded-lg">
          💪 Tingkatkan level dengan rajin berdzikir!
        </div>
      </CardContent>
    </Card>
  );
};