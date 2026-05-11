import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedbackReactions } from '../FeedbackReactions';
import { FeedbackReaction } from '@/../../../packages/shared-types/src/feedback';

describe('FeedbackReactions', () => {
  describe('rendering', () => {
    it('should render all reaction buttons', () => {
      const onReactionSelect = vi.fn();
      render(<FeedbackReactions onReactionSelect={onReactionSelect} />);

      expect(screen.getByRole('button', { name: /👎 Dislike/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /😐 Neutral/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /👍 Like/i })).toBeInTheDocument();
    });

    it('should render with no selected reaction by default', () => {
      const onReactionSelect = vi.fn();
      render(<FeedbackReactions onReactionSelect={onReactionSelect} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).not.toHaveClass('bg-primary');
      });
    });

    it('should render with selected reaction when provided', () => {
      const onReactionSelect = vi.fn();
      render(<FeedbackReactions onReactionSelect={onReactionSelect} selectedReaction={FeedbackReaction.LIKE} />);

      const likeButton = screen.getByRole('button', { name: /👍 Like/i });
      expect(likeButton).toHaveClass('bg-primary');
    });
  });

  describe('interactions', () => {
    it('should call onReactionSelect when a reaction button is clicked', async () => {
      const user = userEvent.setup();
      const onReactionSelect = vi.fn();
      render(<FeedbackReactions onReactionSelect={onReactionSelect} />);

      const likeButton = screen.getByRole('button', { name: /👍 Like/i });
      await user.click(likeButton);

      expect(onReactionSelect).toHaveBeenCalledWith(FeedbackReaction.LIKE);
      expect(onReactionSelect).toHaveBeenCalledTimes(1);
    });

    it('should update selected state when different reaction is clicked', async () => {
      const onReactionSelect = vi.fn();
      const { rerender } = render(
        <FeedbackReactions onReactionSelect={onReactionSelect} selectedReaction={FeedbackReaction.LIKE} />,
      );

      let likeButton = screen.getByRole('button', { name: /👍 Like/i });
      expect(likeButton).toHaveClass('bg-primary');

      rerender(<FeedbackReactions onReactionSelect={onReactionSelect} selectedReaction={FeedbackReaction.NEUTRAL} />);

      const neutralButton = screen.getByRole('button', { name: /😐 Neutral/i });
      expect(neutralButton).toHaveClass('bg-primary');

      likeButton = screen.getByRole('button', { name: /👍 Like/i });
      expect(likeButton).not.toHaveClass('bg-primary');
    });

    it('should allow deselecting a reaction by clicking the same button again', async () => {
      const user = userEvent.setup();
      const onReactionSelect = vi.fn();
      render(<FeedbackReactions onReactionSelect={onReactionSelect} selectedReaction={FeedbackReaction.LIKE} />);

      const likeButton = screen.getByRole('button', { name: /👍 Like/i });
      await user.click(likeButton);

      expect(onReactionSelect).toHaveBeenCalledWith(undefined);
    });

    it('should handle all reaction types', async () => {
      const user = userEvent.setup();
      const onReactionSelect = vi.fn();
      render(<FeedbackReactions onReactionSelect={onReactionSelect} />);

      const dislikeButton = screen.getByRole('button', { name: /👎 Dislike/i });
      await user.click(dislikeButton);
      expect(onReactionSelect).toHaveBeenCalledWith(FeedbackReaction.DISLIKE);

      const neutralButton = screen.getByRole('button', { name: /😐 Neutral/i });
      await user.click(neutralButton);
      expect(onReactionSelect).toHaveBeenCalledWith(FeedbackReaction.NEUTRAL);

      const likeButton = screen.getByRole('button', { name: /👍 Like/i });
      await user.click(likeButton);
      expect(onReactionSelect).toHaveBeenCalledWith(FeedbackReaction.LIKE);
    });
  });

  describe('accessibility', () => {
    it('should have accessible button labels', () => {
      const onReactionSelect = vi.fn();
      render(<FeedbackReactions onReactionSelect={onReactionSelect} />);

      expect(screen.getByRole('button', { name: /👎 Dislike/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /😐 Neutral/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /👍 Like/i })).toBeInTheDocument();
    });

    it('should indicate selected state to screen readers', () => {
      const onReactionSelect = vi.fn();
      render(<FeedbackReactions onReactionSelect={onReactionSelect} selectedReaction={FeedbackReaction.LIKE} />);

      const likeButton = screen.getByRole('button', { name: /👍 Like/i });
      expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
